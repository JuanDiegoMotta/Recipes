<?php
session_start();

// Destruir todas las variables de sesión.
$_SESSION = [];

// Finalmente, destruir la sesión.
session_destroy();

// Respuesta JSON de éxito
$response = [
    'success' => true,
    'message' => 'Session closed successfully.'
];

header('Content-Type: application/json');
echo json_encode($response);
