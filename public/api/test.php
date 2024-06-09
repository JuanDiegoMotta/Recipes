<?php
require 'database.php';
session_start();
header('Content-Type: application/json');
// Conexión a la base de datos
$conn = conectarDb();
$userId = 1;
$data = ['diet' => 'vegan', 'allergies' => 'egg,seafood'];


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
