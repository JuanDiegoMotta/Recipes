<?php 

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\LoginController;
use Controllers\PaginasController;
use Controllers\RecipeController;
use Controllers\CheckoutController;

$router = new Router();

// Zona pública
$router->get('/', [PaginasController::class, 'index']);
$router->get('/food-market', [PaginasController::class, 'food_market']);
$router->get('/recipe-discovery', [RecipeController::class, 'recipeDiscovery']);
$router->get('/recipe', [PaginasController::class, 'recipe']);

$router->get('/checkout', [CheckoutController::class, 'checkout']);
$router->post('/checkout/createSession', [CheckoutController::class, 'createSession']);
$router->get('/checkout/success', [CheckoutController::class, 'success']);


$router->get('/about', [PaginasController::class, 'about']);
$router->get('/contact', [PaginasController::class, 'contact']);
$router->post('/contact', [PaginasController::class, 'contact']);

//Login y Autenticación
$router->get('/login', [LoginController::class, 'login']);
$router->post('/login', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

//Perfil
$router->get('/profile', [PaginasController::class, 'profile']);
$router->get('/register', [LoginController::class, 'register']);

//My Kitchen
$router->get('/mykitchen', [PaginasController::class, 'myKitchen']);

$router->comprobarRutas();