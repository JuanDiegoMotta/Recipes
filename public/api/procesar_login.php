<?php
session_start();
header('Content-Type: application/json');

require 'database.php';

// Conexión a la base de datos
$conn = conectarDb();

// Leer la solicitud JSON
$input = json_decode(file_get_contents('php://input'), true);

// Obtener los datos del formulario
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

// Validar entrada
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// Preparar la consulta
$sql = "
    SELECT u.id, us.pwd 
    FROM USERS u
    JOIN USERS_SECURITY us ON u.id = us.user_id
    WHERE u.email = ?
";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->bind_result($userId, $hashedPasswordFromDb);
    $stmt->fetch();
    $stmt->close();

    // Verificar la contraseña
    if (password_verify($password, $hashedPasswordFromDb)) {
        // Guardar el userId en la sesión
        $_SESSION['user_id'] = $userId;
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare SQL statement']);
}

$conn->close();
?>
