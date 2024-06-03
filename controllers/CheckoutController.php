<?php
    namespace Controllers;

    use MVC\Router;

    class CheckoutController {
        public static function checkout(Router $router) {
            $home = true;
            $script = '/build/js/checkout.js';
            
            $router->render('pages/checkout', [
                'home' => $home,
                'script' => $script
            ]);
        }
    
        public static function createSession() {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                \Stripe\Stripe::setApiKey('sk_test_51PH5DxJR9DMxZqlKwlABmwVwArTedmnHl5xUFY8dJAVbdm67Y4kiOXwht60DCkXCNpXvcNmQTsWXIZmLW16Ah6A200O5TTdpM1');
    
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');
        
                try {
                    $checkout_session = \Stripe\Checkout\Session::create([
                        'line_items' => [
                            [
                                'price' => 'price_1PMrjqJR9DMxZqlK6FY49Skl',
                                'quantity' => 1,
                            ],
                            [
                                'price' => 'price_1PNFbHJR9DMxZqlKXf1FnqTn',
                                'quantity' => 2,
                            ]
                        ],
                        'mode' => 'payment',
                        'success_url' => 'http://localhost:3000/checkout/success',
                        'cancel_url' => 'http://localhost:3000/checkout/cancel',
                      ]);

                      echo json_encode(['url' => $checkout_session->url]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
            }
        }
    
        public static function success(Router $router) {
            // Render a success page or handle success logic
            $router->render('checkout/success', []);
        }
    
        public static function cancel(Router $router) {
            // Render a cancel page or handle cancellation logic
            $router->render('checkout/cancel', []);
        }
    }
?>