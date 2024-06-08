<?php
    namespace Controllers;

    use MVC\Router;

    class PaginasController {

        public static function index(Router $router) {
            $css = "/build/css/index.css";
            $script = "/build/js/index.js";
            
            $router->render('pages/index', [
                "css" => $css,
                "script" => $script
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
        
        public static function checkout( Router $router ) {

            $home = true;
            $script = '/build/js/checkout.js';
            
            $router->render('pages/checkout', [
                'home' => $home,
                'script' => $script
            ]);
        }

        public static function profile(Router $router){
            $css = '/build/css/profile.css';
            $script = '../build/js/profile.js';

            $router->render('pages/profile', [
                'css' => $css,
                'script' => $script
            ]);
        }
    }
?>