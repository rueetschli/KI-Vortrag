<?php
/**
 * KI-AKADEMIE - Task Submissions API
 * Simple file-based storage for cross-device task submissions.
 * Submissions are stored as JSON files in the data/ directory.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Get task ID
$taskId = $_GET['task'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$taskId) {
    $input = json_decode(file_get_contents('php://input'), true);
    $taskId = $input['taskId'] ?? null;
}

// Special: clear all submissions (DELETE without task ID)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && !$taskId) {
    $files = glob("$dataDir/*.json");
    foreach ($files as $f) {
        unlink($f);
    }
    echo json_encode(['success' => true]);
    exit;
}

if (!$taskId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing task parameter']);
    exit;
}

// Sanitize task ID to prevent path traversal
$taskId = preg_replace('/[^a-zA-Z0-9_-]/', '', $taskId);
if (strlen($taskId) === 0 || strlen($taskId) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid task ID']);
    exit;
}

$filePath = "$dataDir/$taskId.json";

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (file_exists($filePath)) {
            readfile($filePath);
        } else {
            echo '[]';
        }
        break;

    case 'POST':
        if (!isset($input)) {
            $input = json_decode(file_get_contents('php://input'), true);
        }

        if (!$input || empty($input['name']) || empty($input['content'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (name, content)']);
            exit;
        }

        // Use file locking for concurrent writes
        $lockFile = "$filePath.lock";
        $lock = fopen($lockFile, 'w');
        if (!flock($lock, LOCK_EX)) {
            fclose($lock);
            http_response_code(503);
            echo json_encode(['error' => 'Server busy, try again']);
            exit;
        }

        $submissions = [];
        if (file_exists($filePath)) {
            $data = file_get_contents($filePath);
            $submissions = json_decode($data, true) ?? [];
        }

        $name = mb_substr(strip_tags($input['name']), 0, 100);
        $group = mb_substr(strip_tags($input['group'] ?? ''), 0, 100);
        $content = mb_substr($input['content'], 0, 50000);

        // Find existing submission from same user+group (update instead of duplicate)
        $existingIdx = -1;
        foreach ($submissions as $idx => $sub) {
            if ($sub['name'] === $name && ($sub['group'] ?? '') === $group) {
                $existingIdx = $idx;
                break;
            }
        }

        $submission = [
            'name' => $name,
            'group' => $group,
            'content' => $content,
            'timestamp' => date('c')
        ];

        if ($existingIdx >= 0) {
            $submissions[$existingIdx] = $submission;
        } else {
            $submissions[] = $submission;
        }

        file_put_contents($filePath, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        flock($lock, LOCK_UN);
        fclose($lock);
        @unlink($lockFile);

        echo json_encode(['success' => true, 'count' => count($submissions)]);
        break;

    case 'DELETE':
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
