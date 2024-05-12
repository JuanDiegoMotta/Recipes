<?php

require 'funciones.php';
require 'config/database.php';
require __DIR__ . '/../vendor/autoload.php';

// Conectarnos a la BD

$db = conectarDb();

// DE MOMENTO NO VAMOS A USAR ACTIVE RECORD ASI QUE SE QUEDA COMENTADO POR SI EN UN FUTURO SI

// use Model\ActiveRecord;
// ActiveRecord::setDB($db);
