<?php

namespace Controllers;

use MVC\Router;

class RecipeController {

    private static $apiKey = "5150b11e51f7451cab0fc41f6188faa5";

    public static function recipeDiscovery(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['query'])) {
            $query = $_GET['query'];
            $filters = [
                'cuisine' => $_GET['cuisine'] ?? '',
                'diet' => $_GET['diet'] ?? '',
                'intolerances' => $_GET['intolerances'] ?? '',
                'includeIngredients' => $_GET['includeIngredients'] ?? '',
                'excludeIngredients' => $_GET['excludeIngredients'] ?? '',
                'type' => $_GET['type'] ?? '',
                'maxReadyTime' => $_GET['maxReadyTime'] ?? '',
                'sort' => $_GET['sort'] ?? '',
                'sortDirection' => $_GET['sortDirection'] ?? '',
                'minCalories' => $_GET['minCalories'] ?? '',
                'maxCalories' => $_GET['maxCalories'] ?? '',
                'number' => $_GET['number'] ?? '10'
            ];

            $results = self::searchRecipes($query, $filters);

            header('Content-Type: application/json');
            echo json_encode($results);
        } else {
            $css = "/build/css/recipe_discovery.css";
            $script = "/build/js/recipe_discovery.js";

            $router->render('pages/recipe_discovery', [
                "css" => $css,
                "script" => $script
            ]);
        }
    }

    private static function searchRecipes($query, $filters = []) {
        $url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" . self::$apiKey;
        $url .= "&query=" . urlencode($query);

        foreach ($filters as $key => $value) {
            if (!empty($value)) {
                $url .= "&" . $key . "=" . urlencode($value);
            }
        }

        $response = file_get_contents($url);
        return json_decode($response, true);
    }
}
?>
