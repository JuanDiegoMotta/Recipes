<?php
    namespace Controllers;

    use MVC\Router;

    class LoginController {

        public static function login( Router $router ) {
            
            $router->render('auth/login', []);
        }

        public static function register( Router $router ) {
    
            $script = '/build/js/proceso_registro.js';
            $styles = '/build/css/proceso_registro.css';

            $router->render('pages/register', [
                'script' => $script,
                'styles' => $styles
            ]);
        }
        
    }
?>