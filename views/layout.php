<?php 
    if(!isset($_SESSION)) {
        session_start();
    }

    $auth = $_SESSION['login'] ?? false;

 ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipes</title>
    <link rel="stylesheet" href="../build/css/main.css">
</head>
<body>
    

    <?php incluirTemplate('header') ?>


    <?php echo $contenido; ?>


    <?php incluirTemplate('footer') ?>

    <script src="../build/js/app.js"></script>
</body>
</html>