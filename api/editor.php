<?php
/**
 * KI-AKADEMIE - Editor API
 * Backend for instructor content management
 *
 * Endpoints:
 *   POST ?action=auth           → Verify instructor password
 *   POST ?action=change-password → Change instructor password
 *   GET  ?action=files          → List all .md files in content/
 *   GET  ?action=file&name=...  → Read a specific .md file
 *   POST ?action=file           → Save/create a .md file (body: {name, content})
 *   DELETE ?action=file&name=...→ Delete a .md file
 *   GET  ?action=modules        → Read modules.json
 *   POST ?action=modules        → Save modules.json (body: {modules: [...]})
 *   GET  ?action=config         → Read site settings
 *   POST ?action=config         → Save site settings (body: {site: {...}})
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Instructor-Auth');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configPath = __DIR__ . '/../config.php';
$contentDir = __DIR__ . '/../content';

// Load config
function loadConfig() {
    global $configPath;
    if (!file_exists($configPath)) {
        return [
            'password' => 'dozent2026',
            'site' => []
        ];
    }
    return require $configPath;
}

// Save config
function saveConfig($config) {
    global $configPath;
    $code = "<?php\n/**\n * KI-AKADEMIE - Konfigurationsdatei\n * Enthält Passwort und Seiteneinstellungen\n */\n\nreturn ";
    $code .= var_export_short($config);
    $code .= ";\n";
    file_put_contents($configPath, $code, LOCK_EX);
}

// Generate compact array export
function var_export_short($var, $indent = '') {
    if (is_array($var)) {
        $indexed = array_keys($var) === range(0, count($var) - 1);
        $items = [];
        foreach ($var as $key => $value) {
            $items[] = $indent . '    '
                . ($indexed ? '' : var_export($key, true) . ' => ')
                . var_export_short($value, $indent . '    ');
        }
        return "[\n" . implode(",\n", $items) . ",\n" . $indent . ']';
    }
    return var_export($var, true);
}

// Verify instructor auth header
function checkAuth() {
    $authPw = $_SERVER['HTTP_X_INSTRUCTOR_AUTH'] ?? '';
    if (empty($authPw)) return false;
    $config = loadConfig();
    return $authPw === $config['password'];
}

// Sanitize filename
function sanitizeFilename($name) {
    $name = basename($name);
    $name = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $name);
    if (!preg_match('/\.md$/i', $name)) {
        $name .= '.md';
    }
    return $name;
}

$action = $_GET['action'] ?? '';

switch ($action) {

    // ---- Authenticate ----
    case 'auth':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $password = $input['password'] ?? '';
        $config = loadConfig();
        if ($password === $config['password']) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid password']);
        }
        break;

    // ---- Change Password ----
    case 'change-password':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            break;
        }
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $oldPw = $input['oldPassword'] ?? '';
        $newPw = $input['newPassword'] ?? '';

        if (strlen($newPw) < 4) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 4 characters']);
            break;
        }

        $config = loadConfig();
        if ($oldPw !== $config['password']) {
            http_response_code(401);
            echo json_encode(['error' => 'Current password is incorrect']);
            break;
        }

        $config['password'] = $newPw;
        saveConfig($config);
        echo json_encode(['success' => true]);
        break;

    // ---- List .md Files ----
    case 'files':
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'GET required']);
            break;
        }
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $files = glob("$contentDir/*.md");
        $result = [];
        foreach ($files as $f) {
            $name = basename($f);
            $result[] = [
                'name' => $name,
                'size' => filesize($f),
                'modified' => date('c', filemtime($f))
            ];
        }
        usort($result, function($a, $b) { return strcmp($a['name'], $b['name']); });
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        break;

    // ---- Read / Save / Delete .md File ----
    case 'file':
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $name = sanitizeFilename($_GET['name'] ?? '');
            $path = "$contentDir/$name";
            if (!file_exists($path)) {
                http_response_code(404);
                echo json_encode(['error' => 'File not found']);
                break;
            }
            echo json_encode([
                'name' => $name,
                'content' => file_get_contents($path)
            ], JSON_UNESCAPED_UNICODE);
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $name = sanitizeFilename($input['name'] ?? '');
            $content = $input['content'] ?? '';

            if (empty($name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Filename required']);
                break;
            }

            $path = "$contentDir/$name";
            file_put_contents($path, $content, LOCK_EX);

            // Auto-update modules.json
            updateModulesJson($contentDir);

            echo json_encode(['success' => true, 'name' => $name]);
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $name = sanitizeFilename($_GET['name'] ?? '');
            $path = "$contentDir/$name";
            if (file_exists($path)) {
                unlink($path);
                // Auto-update modules.json
                updateModulesJson($contentDir);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'File not found']);
            }
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    // ---- Read / Save modules.json ----
    case 'modules':
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        $modulesPath = "$contentDir/modules.json";

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (file_exists($modulesPath)) {
                readfile($modulesPath);
            } else {
                echo json_encode(['modules' => []]);
            }
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid JSON']);
                break;
            }
            file_put_contents($modulesPath, json_encode($input, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
            echo json_encode(['success' => true]);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    // ---- Read / Save Site Config ----
    case 'config':
        if (!checkAuth()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $config = loadConfig();
            echo json_encode(['site' => $config['site'] ?? []], JSON_UNESCAPED_UNICODE);
            break;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['site'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data']);
                break;
            }
            $config = loadConfig();
            $config['site'] = $input['site'];
            saveConfig($config);
            echo json_encode(['success' => true]);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action. Use: auth, change-password, files, file, modules, config']);
}

/**
 * Auto-update modules.json based on existing .md files.
 * Preserves order for known files, appends new ones at the end.
 */
function updateModulesJson($contentDir) {
    $modulesPath = "$contentDir/modules.json";

    // Read current modules.json
    $config = [];
    if (file_exists($modulesPath)) {
        $config = json_decode(file_get_contents($modulesPath), true) ?? [];
    }

    $currentModules = $config['modules'] ?? [];

    // Get all .md files
    $existingFiles = [];
    foreach (glob("$contentDir/*.md") as $f) {
        $existingFiles[] = basename($f);
    }
    sort($existingFiles);

    // Remove deleted files from module list
    $updatedModules = array_filter($currentModules, function($m) use ($existingFiles) {
        return in_array($m, $existingFiles);
    });
    $updatedModules = array_values($updatedModules);

    // Add new files that aren't in the list yet
    foreach ($existingFiles as $f) {
        if (!in_array($f, $updatedModules)) {
            $updatedModules[] = $f;
        }
    }

    $config['modules'] = $updatedModules;
    file_put_contents($modulesPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}
