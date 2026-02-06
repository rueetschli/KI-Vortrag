<?php
/**
 * KI-AKADEMIE - Real-Time Sync API
 * Handles:
 *   1. Instructor slide state broadcasting (remote control)
 *   2. Student score reporting
 *   3. Student score retrieval (for instructor dashboard)
 *
 * Endpoints:
 *   GET  ?action=slide           → Get current instructor slide index
 *   POST ?action=slide           → Set current slide index (instructor)
 *   POST ?action=score           → Report student score
 *   GET  ?action=scores          → Get all student scores (instructor)
 *   DELETE ?action=scores        → Clear all student scores
 *   GET  ?action=feedback        → Get all MC/scale/text feedback
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$action = $_GET['action'] ?? '';

switch ($action) {

    // ---- Slide State (Remote Control) ----
    case 'slide':
        $filePath = "$dataDir/_slide-state.json";

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (file_exists($filePath)) {
                readfile($filePath);
            } else {
                echo json_encode(['slide' => 0, 'timestamp' => 0]);
            }
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $state = [
                'slide' => (int)($input['slide'] ?? 0),
                'moduleIndex' => (int)($input['moduleIndex'] ?? 0),
                'slideIndex' => (int)($input['slideIndex'] ?? 0),
                'timestamp' => time()
            ];
            file_put_contents($filePath, json_encode($state));
            echo json_encode(['success' => true]);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    // ---- Student Scores ----
    case 'score':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            break;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing name']);
            break;
        }

        $filePath = "$dataDir/_scores.json";

        $lock = fopen("$filePath.lock", 'w');
        if (!flock($lock, LOCK_EX)) {
            fclose($lock);
            http_response_code(503);
            echo json_encode(['error' => 'Server busy']);
            break;
        }

        $scores = [];
        if (file_exists($filePath)) {
            $scores = json_decode(file_get_contents($filePath), true) ?? [];
        }

        $name = mb_substr(strip_tags($input['name']), 0, 100);
        $studentId = $input['studentId'] ?? '';

        // Find existing entry by name+id
        $existingIdx = -1;
        foreach ($scores as $idx => $s) {
            if ($s['name'] === $name && ($s['studentId'] ?? '') === $studentId) {
                $existingIdx = $idx;
                break;
            }
        }

        $entry = [
            'name' => $name,
            'studentId' => $studentId,
            'earned' => (int)($input['earned'] ?? 0),
            'total' => (int)($input['total'] ?? 0),
            'percentage' => (int)($input['percentage'] ?? 0),
            'exercises' => $input['exercises'] ?? [],
            'timestamp' => date('c')
        ];

        if ($existingIdx >= 0) {
            $scores[$existingIdx] = $entry;
        } else {
            $scores[] = $entry;
        }

        file_put_contents($filePath, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        flock($lock, LOCK_UN);
        fclose($lock);
        @unlink("$filePath.lock");

        echo json_encode(['success' => true, 'count' => count($scores)]);
        break;

    case 'scores':
        $filePath = "$dataDir/_scores.json";

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (file_exists($filePath)) {
                readfile($filePath);
            } else {
                echo '[]';
            }
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            if (file_exists($filePath)) unlink($filePath);
            // Also clear slide state
            $slideFile = "$dataDir/_slide-state.json";
            if (file_exists($slideFile)) unlink($slideFile);
            echo json_encode(['success' => true]);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    case 'feedback':
        $filePath = "$dataDir/_scores.json";

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (!file_exists($filePath)) {
                echo json_encode([]);
                break;
            }
            $scores = json_decode(file_get_contents($filePath), true) ?? [];

            // Extract feedback exercises (scale, text-input, multiple-choice) from all students
            $feedback = [];
            foreach ($scores as $student) {
                $exercises = $student['exercises'] ?? [];
                foreach ($exercises as $exId => $ex) {
                    $type = $ex['type'] ?? '';
                    if ($type === 'scale' || $type === 'text-input' || $type === 'multiple-choice') {
                        $entry = [
                            'student' => $student['name'],
                            'exerciseId' => $exId,
                            'type' => $type,
                            'value' => $ex['value'] ?? '',
                            'title' => $ex['title'] ?? $exId
                        ];
                        if (isset($ex['valueLabel'])) {
                            $entry['valueLabel'] = $ex['valueLabel'];
                        }
                        $feedback[] = $entry;
                    }
                }
            }
            echo json_encode($feedback, JSON_UNESCAPED_UNICODE);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action. Use: slide, score, scores, feedback']);
}
