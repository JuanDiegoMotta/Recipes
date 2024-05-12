<?php 

define('TEMPLATES_URL', __DIR__ . '/templates');

function incluirTemplate( string  $nombre) {
    include TEMPLATES_URL . "/$nombre.php"; 
}

function debug($variable) {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

 ?>