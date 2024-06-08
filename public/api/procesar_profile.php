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
$userId = 1;
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

        case 'updateProfile':
            $data = $input['data'] ?? [];
            $formId = $input['formId'] ?? [];
            updateProfile($conn, $userId, $data, $formId);
            break;
        case 'updateGoal':
            $data = $input['data'] ?? [];
            $formId = $input['formId'] ?? [];
            updateGoal($conn, $userId, $data, $formId);
            break;
        case 'updateDiet':
            $data = $input['data'] ?? [];
            $formId = $input['formId'] ?? [];
            updateDiet($conn, $userId, $data, $formId);
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

function updateProfile($conn, $userId, $data, $formId) {
    if ($formId === 'form_myprofile') {

        // Inicializar las variables para actualizar las dos tablas
        $usersUpdates = [];
        $usersTypes = '';
        $usersValues = [];

        $profilesUpdates = [];
        $profilesTypes = '';
        $profilesValues = [];

        // Actualización de la tabla USERS
        if (!empty($email)) {
            $usersUpdates[] = 'email = ?';
            $usersTypes .= 's';
            $usersValues[] = $email;
        }

        if (array_key_exists('name', $data)) {
            $usersUpdates[] = 'name = ?';
            $usersTypes .= 's';
            $usersValues[] = $data['name'];
        }

        if (array_key_exists('surname', $data)) {
            $usersUpdates[] = 'surname = ?';
            $usersTypes .= 's';
            $usersValues[] = $data['surname'];
        }

        if (!empty($usersUpdates)) {
            $usersTypes .= 'i';
            $usersValues[] = $userId;

            $usersSql = 'UPDATE USERS SET ' . implode(', ', $usersUpdates) . ' WHERE id = ?';
            $usersStmt = $conn->prepare($usersSql);
            $usersStmt->bind_param($usersTypes, ...$usersValues);

            if (!$usersStmt->execute()) {
                echo json_encode(['success' => false, 'message' => 'Failed to update USERS table']);
                $usersStmt->close();
                return;
            }

            $usersStmt->close();
        }

        // Actualización de la tabla USERS_PROFILES
        if (array_key_exists('birthdate', $data)) {
            $profilesUpdates[] = 'birth_date = ?';
            $profilesTypes .= 's';
            $profilesValues[] = $data['birthdate'];
        }

        if (array_key_exists('gender', $data)) {
            $profilesUpdates[] = 'gender = ?';
            $profilesTypes .= 's';
            $profilesValues[] = $data['gender'];
        }

        if (!empty($profilesUpdates)) {
            $profilesTypes .= 'i';
            $profilesValues[] = $userId;

            $profilesSql = 'UPDATE USERS_PROFILES SET ' . implode(', ', $profilesUpdates) . ' WHERE user_id = ?';
            $profilesStmt = $conn->prepare($profilesSql);
            $profilesStmt->bind_param($profilesTypes, ...$profilesValues);

            if ($profilesStmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update USERS_PROFILES table']);
            }

            $profilesStmt->close();
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid formId for updateProfile']);
    }
}


// Función para actualizar los objetivos
function updateGoal($conn, $userId, $data, $formId) {
    if ($formId === 'form_mygoals') {
        $goal = $data['goal'] ?? null;
        $height = isset($data['height']) && $data['height'] !== '' ? $data['height'] : null;
        $weight = isset($data['weight']) && $data['weight'] !== '' ? $data['weight'] : null;
        $activity = $data['activity'] ?? null;
        $calories = isset($data['calories']) && $data['calories'] !== '' ? $data['calories'] : null;

        $updates = [];
        $types = '';
        $values = [];

        if (isset($goal)) {
            $updates[] = 'goal = ?';
            $types .= 'i';
            $values[] = $goal;
        } else {
            $updates[] = 'goal = NULL';
        }

        $updates[] = 'height = ?';
        $types .= 'd';
        $values[] = $height;

        $updates[] = 'weight = ?';
        $types .= 'd';
        $values[] = $weight;

        if (isset($activity)) {
            $updates[] = 'activity = ?';
            $types .= 'i';
            $values[] = $activity;
        } else {
            $updates[] = 'activity = NULL';
        }

        $updates[] = 'estimated_calories = ?';
        $types .= 'i';
        $values[] = $calories;

        $types .= 'i';
        $values[] = $userId;

        $sql = 'UPDATE USERS_PROFILES SET ' . implode(', ', $updates) . ' WHERE user_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update goal']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid formId for updateGoal']);
    }
}

// Función para actualizar la dieta
function updateDiet($conn, $userId, $data, $formId) {
    if ($formId === 'form_mydiet') {
        $diet = $data['diet'] ?? null;
        $allergies = isset($data['allergies']) && $data['allergies'] !== '' ? $data['allergies'] : null;
        $other = isset($data['other']) && $data['other'] !== '' ? $data['other'] : null;

        $updates = [];
        $types = '';
        $values = [];

        if (isset($diet)) {
            $updates[] = 'diet_type = ?';
            $types .= 's';
            $values[] = $diet;
        } else {
            $updates[] = 'diet_type = NULL';
        }

        $updates[] = 'food_allergies = ?';
        $types .= 's';
        $values[] = $allergies;

        $updates[] = 'other_allergies = ?';
        $types .= 's';
        $values[] = $other;

        $types .= 'i';
        $values[] = $userId;

        $sql = 'UPDATE USERS_PROFILES SET ' . implode(', ', $updates) . ' WHERE user_id = ?';
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update diet']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid formId for updateDiet']);
    }
}
