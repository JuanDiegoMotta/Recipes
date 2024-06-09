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

$query = $conn->prepare("SELECT api_id FROM user_recipes WHERE user_id = ?");
$query->bind_param("i", $userId);
$query->execute();
$result = $query->get_result();

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = $row['api_id'];
}

echo json_encode(['success' => true, 'favorites' => $favorites]);
?>
