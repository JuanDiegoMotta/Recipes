<?php

class Recipe {
    private $apiKey;

    public function __construct() {
        $this->apiKey = "5150b11e51f7451cab0fc41f6188faa5";
    }

    public function searchRecipes($query, $filters = []) {
        $url = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" . $this->apiKey;
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
