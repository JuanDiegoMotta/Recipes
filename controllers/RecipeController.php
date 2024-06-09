<?php

namespace Controllers;

use MVC\Router;

class RecipeController {

    private static $apiKey = "e55f6c46f01c43acb40708b8f14c78e3";

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
        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
            $recipeId = $_GET['id'];
            $recipeDetails = self::getRecipeDetails($recipeId);

            header('Content-Type: application/json');
            echo json_encode($recipeDetails);
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

    private static function getRecipeDetails($id) {
        $url = "https://api.spoonacular.com/recipes/{$id}/information?apiKey=" . self::$apiKey;
        $response = file_get_contents($url);
        return json_decode($response, true);
    }
}
?>
