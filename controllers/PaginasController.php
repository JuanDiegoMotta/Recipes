<?php
    namespace Controllers;

    use MVC\Router;

    class PaginasController {

        public static function index(Router $router) {
            $css = "/build/css/index.css";
            
            $router->render('pages/index', [
                "css" => $css
            ]);
        }

        public static function food_market( Router $router ) {
            
            $script = '/build/js/food_market.js';

            $router->render('pages/food_market', [
                'script' => $script
            ]);
        }
        
    }
?>