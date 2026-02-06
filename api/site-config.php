<?php
/**
 * KI-AKADEMIE - Public Site Config
 * Returns site display settings (no password or sensitive data)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$configPath = __DIR__ . '/../config.php';

if (!file_exists($configPath)) {
    echo '{}';
    exit;
}

$config = require $configPath;
$site = $config['site'] ?? [];

// Only expose display settings, never the password
echo json_encode($site, JSON_UNESCAPED_UNICODE);
