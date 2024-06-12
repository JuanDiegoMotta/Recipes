<?php
session_start();
header('Content-Type: application/json');

require 'database.php';
$conn = conectarDb();

if (!isset($_SESSION['user_id'])) {

    echo json_encode(['success' => false, 'redirect' => '/login']);
    exit();
    
} else {

    $userId = $_SESSION['user_id'];
    $input = json_decode(file_get_contents('php://input'), true);
    $api_id = $input['api_id'];

    if (empty($api_id)) {
        echo json_encode(['success' => false, 'message' => 'Recipe ID is required']);
        exit();
    }

    // Verificar si la receta ya está en favoritos
    $check_favorite = $conn->prepare("SELECT * FROM user_recipes WHERE user_id = ? AND api_id = ?");
    $check_favorite->bind_param("is", $userId, $api_id);
    $check_favorite->execute();
    $favorite_result = $check_favorite->get_result();

    if ($favorite_result->num_rows > 0) {
        // Si la receta ya está en favoritos, eliminarla
        $delete_favorite = $conn->prepare("DELETE FROM user_recipes WHERE user_id = ? AND api_id = ?");
        $delete_favorite->bind_param("is", $userId, $api_id);
        if ($delete_favorite->execute()) {
            echo json_encode(['success' => true, 'message' => 'Recipe removed from favorites', 'isFavorite' => false]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to remove recipe from favorites']);
        }
    } else {
        // Si la receta no está en favoritos, agregarla
        $insert_favorite = $conn->prepare("INSERT INTO user_recipes (user_id, api_id) VALUES (?, ?)");
        $insert_favorite->bind_param("is", $userId, $api_id);
        if ($insert_favorite->execute()) {
            echo json_encode(['success' => true, 'message' => 'Recipe added to favorites', 'isFavorite' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add recipe to favorites']);
        }
    }
}
