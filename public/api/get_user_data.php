<?php
session_start();
header('Content-Type: application/json');

require 'database.php';
$conn = conectarDb();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'redirect' => '/login']);
    exit();
}

$userId = $_SESSION['user_id'];

$query = $conn->prepare("
    SELECT 
        diet_type,
        food_allergies,
    FROM USERS_PROFILES 
    WHERE user_id = ?
");
$query->bind_param("i", $userId);
$query->execute();
$result = $query->get_result();

if ($row = $result->fetch_assoc()) {
    $allergies = explode(',', $row['food_allergies']);

    $userData = [
        'diet_type' => $row['diet_type'],
        'allergies' => $allergies
    ];

    echo json_encode(['success' => true, 'userData' => $userData]);
} else {
    echo json_encode(['success' => false, 'message' => 'User data not found']);
}
?>
