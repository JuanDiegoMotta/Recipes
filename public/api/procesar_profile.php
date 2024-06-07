<?php
session_start();
header('Content-Type: application/json');

require 'database.php';

// Conexión a la base de datos
$conn = conectarDb();

// DESCOMENTAR ESTO EN PRODUCCIÓN

// Verificar si el usuario está autenticado y tiene un ID en la sesión
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(['success' => false, 'message' => 'User not authenticated']);
//     exit;
// }

// BORRAR
$_SESSION['user_id'] = 1;
// FIN BORRAR


$userId = $_SESSION['user_id'];


// Leer la solicitud JSON
$input = json_decode(file_get_contents('php://input'), true);

$action = isset($input['action']) ? $input['action'] : '';

switch ($action) {
    case 'get_profile_data':
        getProfileData($userId);
        break;

    case 'upload_profile_picture':
        uploadProfilePicture($userId, $input['photo']);
        break;

    case 'update_profile_data':
        updateProfileData($userId, $input);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}

$conn->close();

// Función para obtener los datos del perfil
function getProfileData($userId)
{
    global $conn;

    $query ="SELECT u.name, u.surname, u.email, p.photo, p.birth_date, p.gender, 
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

// Función para subir la foto de perfil (vacía)
function uploadProfilePicture($userId, $photo)
{
    // Lógica para subir la foto de perfil se implementará más tarde
    echo json_encode(['success' => false, 'message' => 'Function not implemented yet']);
}

// Función para actualizar los datos del perfil (vacía)
function updateProfileData($userId, $input)
{
    // Lógica para actualizar los datos del perfil se implementará más tarde
    echo json_encode(['success' => false, 'message' => 'Function not implemented yet']);
}
