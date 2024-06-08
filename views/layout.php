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
    <meta http-equiv="Cache-control" content="public">
    <link rel="stylesheet" href="/build/css/main.css">
    <link rel="shortcut icon" href="/build/img/favicon.png" type="image/x-icon">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Manrope:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <link rel="stylesheet" href="/build/css/main.css">
    <?php if(isset($css)): ?>
        <link rel="stylesheet" href="<?php echo $css; ?>">
    <?php endif; ?>
    

    <script src="https://js.stripe.com/v3/" defer></script>
</head>
<body class="<?php echo isset($home) ? 'home' : '' ?>" >
    

    <?php incluirTemplate('header') ?>


    <?php echo $contenido; ?>


    <?php incluirTemplate('footer') ?>

    <?php if(isset($script)): ?>
    <script src="<?php echo $script; ?>"></script>
    <?php endif; ?>
    <script src="../build/js/app.js"></script>
</body>
</html>