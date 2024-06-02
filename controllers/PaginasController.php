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

        public static function recipe(Router $router){
            $script = '/build/js/recipe.js';
            $css = "/build/css/recipe.css";

            $router->render('pages/recipe', [
                'script' => $script,
                'css' => $css
            ]);
        }
        
    }
?>