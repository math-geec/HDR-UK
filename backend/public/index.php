<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Suppress PHP 8.5 deprecation notices for PDO constants (development env).
// PHP 8.5 deprecates `PDO::MYSQL_ATTR_SSL_CA` in favor of `Pdo\\Mysql::ATTR_SSL_CA`.
// Silence E_DEPRECATED to avoid noisy startup messages. Adjust as needed for production.
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Basic global exception/shutdown handlers to capture uncaught errors early during bootstrap
set_exception_handler(function (Throwable $e) {
    $logPath = __DIR__.'/../storage/logs/laravel.log';
    $message = sprintf("[%s] Uncaught Exception: %s in %s:%s\nStack trace:\n%s\n\n", date('Y-m-d H:i:s'), $e->getMessage(), $e->getFile(), $e->getLine(), $e->getTraceAsString());
    @file_put_contents($logPath, $message, FILE_APPEND);
});

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err !== null) {
        $logPath = __DIR__.'/../storage/logs/laravel.log';
        $message = sprintf("[%s] Shutdown Error: %s in %s:%s\n\n", date('Y-m-d H:i:s'), $err['message'], $err['file'] ?? '', $err['line'] ?? '');
        @file_put_contents($logPath, $message, FILE_APPEND);
    }
});

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
