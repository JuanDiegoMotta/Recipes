<?php
    namespace Controllers;

    use MVC\Router;

    class PaginasController {
        public static function index( Router $router ) {
            
            $router->render('pages/index', []);
        }

        public static function food_market( Router $router ) {
            
            $script = '/build/js/food_market.js';

            $router->render('pages/food_market', [
                'script' => $script
            ]);
        }
        
    }
?>