<?php 
    session_start();
    header('Content-Type: application/json');
    
    require 'database.php';
    $conn = conectarDb();
    
    $query = "SELECT * FROM user_myrecipes WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $recipes = [];
        while ($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
        echo json_encode(['success' => true, 'recipes' => $recipes]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No recipes found']);
    }
    
 ?>