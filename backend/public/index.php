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

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
