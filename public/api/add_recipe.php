<?php
session_start();
header('Content-Type: application/json');

require 'database.php';

$response = ['success' => false, 'message' => ''];

// Verificar si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'User not authenticated';
    echo json_encode($response);
    exit();
}

$userId = $_SESSION['user_id'];

// Conexión a la base de datos
$conn = conectarDb();

// Recibir los datos del formulario
$recipeName = $_POST['recipeName'];
$description = $_POST['description'];
$instructions = $_POST['instructions'];
$ingredients = $_POST['ingredients'];
$allergens = $_POST['allergens'];
$prepTime = $_POST['prepTime'];
$calories = $_POST['calories'];
$serves = $_POST['serves'];

// Manejo de la imagen
$photoPath = '';
if (!empty($_FILES['photo']['name'])) {
    $photoTmpPath = $_FILES['photo']['tmp_name'];
    $photoName = basename($_FILES['photo']['name']);

    // Asignar un nombre único al archivo
    $photoNewName = uniqid('recipe_', true) . '.' . pathinfo($photoName, PATHINFO_EXTENSION);
    $photoUploadDir = realpath(dirname(__FILE__) . '/../build/img/recipe_photos');

    // Crear la carpeta si no existe
    if (!is_dir($photoUploadDir)) {
        mkdir($photoUploadDir, 0777, true);
    }

    $photoPath = $photoUploadDir . '/' . $photoNewName;

    // Mover el archivo al directorio de destino
    if (!move_uploaded_file($photoTmpPath, $photoPath)) {
        $response['message'] = 'Failed to upload file';
        echo json_encode($response);
        exit();
    }

    $photoPath = '/build/img/recipe_photos' . $photoNewName; // Ruta relativa desde el documento web
}

try {
    $conn->begin_transaction();

    // Insertar los datos en la tabla USER_MYRECIPES
    $stmt = $conn->prepare("INSERT INTO USER_MYRECIPES (user_id, name, description, instructions, ingredients, allergens, photo, prep_time, calories, serves) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssiii", $userId, $recipeName, $description, $instructions, $ingredients, $allergens, $photoPath, $prepTime, $calories, $serves);

    if ($stmt->execute()) {
        $conn->commit();
        $response['success'] = true;
        $response['message'] = 'Recipe added successfully';
    } else {
        $conn->rollback();
        $response['message'] = 'Failed to add recipe';
    }

    $stmt->close();
} catch (Exception $e) {
    $conn->rollback();
    $response['message'] = 'Database error: ' . $e->getMessage();
}

// Cerrar la conexión
$conn->close();

// Enviar la respuesta JSON
echo json_encode($response);
?>
