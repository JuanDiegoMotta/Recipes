<?php
    namespace Controllers;

    use MVC\Router;

    class CheckoutController {
        public static function checkout(Router $router) {
            $home = true;
            $script = '/build/js/checkout.js';
            $canceled = false;
            if(isset($_GET['canceled'])) {
                $canceled = true;
            }
            
            $router->render('pages/checkout', [
                'home' => $home,
                'script' => $script,
                'canceled' => $canceled
            ]);
        }
    
        public static function createSession() {

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $body = json_decode(file_get_contents('php://input'), true);
                
                $items = [];
                foreach($body as $item) {
                    $items[] = [
                        'price_data' => [
                            'currency' => 'eur',
                            'product_data' => [
                                'name' => $item['name'],
                                'images' => [$item['img']],
                            ],
                            'unit_amount' => $item['price'] * 100,
                        ],
                        'quantity' => $item['quantity'],
                    ];
                }
            
                \Stripe\Stripe::setApiKey('sk_test_51PH5DxJR9DMxZqlKwlABmwVwArTedmnHl5xUFY8dJAVbdm67Y4kiOXwht60DCkXCNpXvcNmQTsWXIZmLW16Ah6A200O5TTdpM1');
    
                header('Content-Type: application/json');
                header('Access-Control-Allow-Origin: *');
        
                try {

                    $checkout_session = \Stripe\Checkout\Session::create([
                        'line_items' => $items,
                        'mode' => 'payment',
                        'success_url' => 'http://localhost:3000/checkout/success',
                        'cancel_url' => 'http://localhost:3000/checkout?canceled',
                      ]);

                      echo json_encode(['url' => $checkout_session->url]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
            }
        }
    
        public static function success(Router $router) {
            $home = true;
            $script = '/build/js/success.js';
            // Render a success page or handle success logic
            $router->render('checkout/success', [
                'home' => $home,
                'script' => $script
            ]);
        }
        
    }
?>