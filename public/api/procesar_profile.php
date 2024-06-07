<?php
session_start();
header('Content-Type: application/json');

require 'database.php';

// Conexión a la base de datos
$conn = conectarDb();

// Verificar si el usuario está autenticado y tiene un ID en la sesión
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit;
}

$userId = $_SESSION['user_id'];

// Detectar si se trata de una solicitud `FormData`
if (!empty($_FILES) && isset($_POST['action']) && $_POST['action'] === 'upload_profile_picture') {
    uploadProfilePicture($userId);
} else {
    // Leer la solicitud JSON
    $input = json_decode(file_get_contents('php://input'), true);

    $action = isset($input['action']) ? $input['action'] : '';

    switch ($action) {
        case 'get_profile_data':
            getProfileData($userId);
            break;

        case 'upload_profile_picture':
            // Este caso puede ser redundante, ya que estamos manejando esto con `FormData`
            break;

        case 'update_profile_data':
            updateProfileData($userId, $input);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
}

$conn->close();

// Función para obtener los datos del perfil
function getProfileData($userId)
{
    global $conn;

    $query = "SELECT u.name, u.surname, u.email, p.photo, p.birth_date, p.gender, 
                     p.goal, p.height, p.weight, p.activity, p.estimated_calories AS calories, 
                     p.diet_type AS diet, p.food_allergies AS allergies, p.other_allergies AS other
              FROM USERS u
              JOIN USERS_PROFILES p ON u.id = p.user_id
              WHERE u.id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $data]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No data found']);
    }

    $stmt->close();
}

// Función para subir la foto de perfil
function uploadProfilePicture($userId)
{
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $photoTmpPath = $_FILES['photo']['tmp_name'];
        $photoName = basename($_FILES['photo']['name']);
        $photoSize = $_FILES['photo']['size'];
        $photoType = $_FILES['photo']['type'];

        // Validar el tamaño y tipo del archivo
        $allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxFileSize = 2 * 1024 * 1024; // 2MB

        if ($photoSize > $maxFileSize || !in_array($photoType, $allowedFileTypes)) {
            echo json_encode(['success' => false, 'message' => 'Invalid file type or size']);
            exit;
        }

        // Asigna un nombre único al archivo
        $photoNewName = uniqid('profile_', true) . '.' . pathinfo($photoName, PATHINFO_EXTENSION);
        $photoUploadDir = realpath(dirname(__FILE__) . '/../build/img/profile_photos');

        // Crear la carpeta si no existe
        if (!is_dir($photoUploadDir)) {
            mkdir($photoUploadDir, 0777, true);
        }

        $photoUploadPath = $photoUploadDir . '/' . $photoNewName;

        // Mover el archivo al directorio de destino
        if (move_uploaded_file($photoTmpPath, $photoUploadPath)) {
            // Guardar la ruta de la foto en la base de datos
            global $conn;
            $photoUrl = '/build/img/profile_photos/' . $photoNewName; // Ruta relativa desde el documento web

            $query = "UPDATE USERS_PROFILES SET photo = ? WHERE user_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("si", $photoUrl, $userId);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'photoUrl' => $photoUrl]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update profile photo']);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No file uploaded or error occurred']);
    }
}

// Función para actualizar los datos del perfil (vacía por ahora)
function updateProfileData($userId, $input)
{
    // Lógica para actualizar los datos del perfil se implementará más tarde
    echo json_encode(['success' => false, 'message' => 'Function not implemented yet']);
}
