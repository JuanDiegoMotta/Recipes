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
            updateProfile($conn, $userId, $data);
            break;
        case 'updateGoal':
            $data = $input['data'] ?? [];
            updateGoal($conn, $userId, $data);
            break;
        case 'updateDiet':
            $data = $input['data'] ?? [];
            updateDiet($conn, $userId, $data);
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

function updateProfile($conn, $userId, $data)
{
    $response = ['success' => false, 'message' => 'No changes made', 'error' => ''];

    // Iniciar la transacción
    $conn->begin_transaction();

    $usersSuccess = true;
    $profilesSuccess = true;

    // Inicializar las variables para actualizar las dos tablas
    $usersUpdates = [];
    $usersTypes = '';
    $usersValues = [];

    $profilesUpdates = [];
    $profilesTypes = '';
    $profilesValues = [];

    // Validación de email único
    if (array_key_exists('email', $data)) {
        $email = $data['email'];

        // Consulta para verificar si el email ya existe para otro usuario
        $emailSql = 'SELECT id FROM USERS WHERE email = ? AND id != ?';
        $emailStmt = $conn->prepare($emailSql);
        if ($emailStmt) {
            $emailStmt->bind_param('si', $email, $userId);
            $emailStmt->execute();
            $emailStmt->store_result();

            if ($emailStmt->num_rows > 0) {
                $emailStmt->close();
                $conn->rollback(); // Revertir la transacción
                $response['message'] = 'Email is already in use by another account.';
                $response['error'] = 'email';
                echo json_encode($response);
                return;
            }

            $emailStmt->close();
        } else {
            $conn->rollback();
            $response['message'] = 'Failed to prepare email validation statement';
            $response['error'] = 'email';
            echo json_encode($response);
            return;
        }

        $usersUpdates[] = 'email = ?';
        $usersTypes .= 's';
        $usersValues[] = $email;
    }

    // Actualización de la tabla USERS
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
        if ($usersStmt) {
            $usersStmt->bind_param($usersTypes, ...$usersValues);

            if (!$usersStmt->execute()) {
                $usersSuccess = false;
                $response['message'] = 'Failed to update USERS table';
                $response['error'] = 'users';
            }

            $usersStmt->close();
        } else {
            $usersSuccess = false;
            $response['message'] = 'Failed to prepare USERS statement';
            $response['error'] = 'users';
        }
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
        if ($profilesStmt) {
            $profilesStmt->bind_param($profilesTypes, ...$profilesValues);

            if (!$profilesStmt->execute()) {
                $profilesSuccess = false;
                $response['message'] = 'Failed to update USERS_PROFILES table';
                $response['error'] = 'profiles';
            }

            $profilesStmt->close();
        } else {
            $profilesSuccess = false;
            $response['message'] = 'Failed to prepare USERS_PROFILES statement';
            $response['error'] = 'profiles';
        }
    }

    // Verificar si todas las actualizaciones fueron exitosas
    if ($usersSuccess && $profilesSuccess) {
        // Confirmar la transacción si ambas actualizaciones fueron exitosas
        if ($conn->commit()) {
            $response['success'] = true;
            $response['message'] = 'Profile updated successfully';
        } else {
            $response['message'] = 'Failed to commit transaction';
            $response['error'] = 'commit';
        }
    } else {
        // Revertir la transacción si alguna actualización falló
        $conn->rollback();
    }

    // Enviar la respuesta JSON final
    echo json_encode($response);
}


function updateGoal($conn, $userId, $data)
{
    $response = ['success' => false, 'message' => 'No changes made'];

    // Iniciar la transacción
    $conn->begin_transaction();

    $goalSuccess = true;

    // Inicializar las variables para actualizar la tabla USERS_PROFILES
    $profilesUpdates = [];
    $profilesTypes = '';
    $profilesValues = [];

    // Actualización de la tabla USERS_PROFILES
    if (array_key_exists('goal', $data)) {
        $profilesUpdates[] = 'goal = ?';
        $profilesTypes .= 'i';
        $profilesValues[] = $data['goal'];
    }

    if (array_key_exists('height', $data)) {
        $profilesUpdates[] = 'height = ?';
        $profilesTypes .= 'd';
        $profilesValues[] = $data['height'];
    }

    if (array_key_exists('weight', $data)) {
        $profilesUpdates[] = 'weight = ?';
        $profilesTypes .= 'd';
        $profilesValues[] = $data['weight'];
    }

    if (array_key_exists('activity', $data)) {
        $profilesUpdates[] = 'activity = ?';
        $profilesTypes .= 'i';
        $profilesValues[] = $data['activity'];
    }

    if (array_key_exists('calories', $data)) {
        $profilesUpdates[] = 'estimated_calories = ?';
        $profilesTypes .= 'i';
        $profilesValues[] = $data['calories'];
    }

    if (!empty($profilesUpdates)) {
        $profilesTypes .= 'i';
        $profilesValues[] = $userId;

        $profilesSql = 'UPDATE USERS_PROFILES SET ' . implode(', ', $profilesUpdates) . ' WHERE user_id = ?';
        $profilesStmt = $conn->prepare($profilesSql);
        if ($profilesStmt) {
            $profilesStmt->bind_param($profilesTypes, ...$profilesValues);

            if (!$profilesStmt->execute()) {
                $goalSuccess = false;
                $response['message'] = 'Failed to update USERS_PROFILES table';
            }

            $profilesStmt->close();
        } else {
            $goalSuccess = false;
            $response['message'] = 'Failed to prepare USERS_PROFILES statement';
        }
    }

    // Verificar si la actualización fue exitosa
    if ($goalSuccess) {
        // Confirmar la transacción si la actualización fue exitosa
        if ($conn->commit()) {
            $response['success'] = true;
            $response['message'] = 'Goal updated successfully';
        } else {
            $response['message'] = 'Failed to commit transaction';
        }
    } else {
        // Revertir la transacción si alguna actualización falló
        $conn->rollback();
    }

    // Enviar la respuesta JSON final
    echo json_encode($response);
}


function updateDiet($conn, $userId, $data)
{
    $response = ['success' => false, 'message' => 'No changes made'];

    // Iniciar la transacción
    $conn->begin_transaction();

    $dietSuccess = true;

    // Inicializar las variables para actualizar la tabla USERS_PROFILES
    $profilesUpdates = [];
    $profilesTypes = '';
    $profilesValues = [];

    // Actualización de la tabla USERS_PROFILES
    if (array_key_exists('diet', $data)) {
        $profilesUpdates[] = 'diet_type = ?';
        $profilesTypes .= 's';
        $profilesValues[] = $data['diet'];
    }

    if (array_key_exists('allergies', $data)) {
        $profilesUpdates[] = 'food_allergies = ?';
        $profilesTypes .= 's';
        $profilesValues[] = $data['allergies'];
    }

    if (array_key_exists('other', $data)) {
        $profilesUpdates[] = 'other_allergies = ?';
        $profilesTypes .= 's';
        $profilesValues[] = $data['other'];
    }

    if (!empty($profilesUpdates)) {
        $profilesTypes .= 'i';
        $profilesValues[] = $userId;

        $profilesSql = 'UPDATE USERS_PROFILES SET ' . implode(', ', $profilesUpdates) . ' WHERE user_id = ?';
        $profilesStmt = $conn->prepare($profilesSql);
        if ($profilesStmt) {
            $profilesStmt->bind_param($profilesTypes, ...$profilesValues);

            if (!$profilesStmt->execute()) {
                $dietSuccess = false;
                $response['message'] = 'Failed to update USERS_PROFILES table';
            }

            $profilesStmt->close();
        } else {
            $dietSuccess = false;
            $response['message'] = 'Failed to prepare USERS_PROFILES statement';
        }
    }

    // Verificar si la actualización fue exitosa
    if ($dietSuccess) {
        // Confirmar la transacción si la actualización fue exitosa
        if ($conn->commit()) {
            $response['success'] = true;
            $response['message'] = 'Diet updated successfully';
        } else {
            $response['message'] = 'Failed to commit transaction';
        }
    } else {
        // Revertir la transacción si alguna actualización falló
        $conn->rollback();
    }

    // Enviar la respuesta JSON final
    echo json_encode($response);
}
