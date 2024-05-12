<?php
    namespace Controllers;

    use MVC\Router;

    class PaginasController {
        public static function index( Router $router ) {
            
            $router->render('pages/index', []);
        }
        
    }
?>