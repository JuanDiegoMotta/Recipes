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

        public static function checkout( Router $router ) {

            $home = true;
            $script = '/build/js/checkout.js';
            
            $router->render('pages/checkout', [
                'home' => $home,
                'script' => $script
            ]);
        }

        public static function profile(Router $router){
            $styles = '/build/css/profile.css';
            $script = '../build/js/profile.js';

            $router->render('pages/profile', [
                'styles' => $styles,
                'script' => $script
            ]);
        }
    }
?>