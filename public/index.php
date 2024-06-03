<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\LoginController;
use MVC\Router;
use Controllers\PaginasController;

$router = new Router();

// Zona pública
$router->get('/', [PaginasController::class, 'index']);
$router->get('/food-market', [PaginasController::class, 'food_market']);
$router->get('/checkout', [PaginasController::class, 'checkout']);
$router->get('/register', [LoginController::class, 'register']);


$router->get('/about', [PaginasController::class, 'about']);
$router->get('/contact', [PaginasController::class, 'contact']);
$router->post('/contact', [PaginasController::class, 'contact']);

//Login y Autenticación
$router->get('/login', [LoginController::class, 'login']);
$router->post('/login', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

//Perfil
$router->get('/profile', [PaginasController::class, 'profile']);

$router->comprobarRutas();