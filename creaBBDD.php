<?php
// incluímos la clase BaseDeDatos mediante un require a 'conecta.php'
require_once 'conecta.php';

// Funcion comprobar si existe
function existeRecipe()
{
    // Creo instancia conexión bbdd
    $bd = new BaseDeDatos();
    $flag = false;
    try {
        if ($bd->conectar()) {
            $conexion = $bd->getConexion();
            // Consulta para verificar si la BBDD existe
            $sql = "SHOW DATABASES LIKE 'Recipe'";
            $result = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
            if (mysqli_num_rows($result) > 0) {
                $flag = true;
            }
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
    $bd->cerrar();
    return $flag;
}

// Función crearBD
function crearBD()
{
    // Creamos una instancia
    $bd = new BaseDeDatos();
    try {
        // Nos conectamos
        if ($bd->conectar()) {
            $conexion = $bd->getConexion();
            $createSql = [
                "CREATE DATABASE Recipe;",
                "USE Recipe;",
                "CREATE TABLE RECIPES (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    instructions TEXT,
                    tags TEXT,
                    description TEXT,
                    photo VARCHAR(255),
                    video VARCHAR(255)
                );",
                "CREATE TABLE INGREDIENTS (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255),
                    brand VARCHAR(255),
                    category VARCHAR(255),
                    photo VARCHAR(255),
                    kcal INT,
                    macros TEXT
                );",
                "CREATE TABLE RECIPES_INGREDIENTS (
                    id_ingredient INT,
                    id_recipe INT,
                    quantity DECIMAL(10,2),
                    PRIMARY KEY (id_ingredient, id_recipe),
                    FOREIGN KEY (id_ingredient) REFERENCES INGREDIENTS(id)
                        ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (id_recipe) REFERENCES RECIPES(id)
                        ON UPDATE CASCADE ON DELETE CASCADE
                );",
                "CREATE TABLE USERS (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255),
                    surname VARCHAR(255),
                    email VARCHAR(255) UNIQUE,
                    pwd VARCHAR(255),
                    admin BOOLEAN,
                    confirmed BOOLEAN,
                    token VARCHAR(255),
                    address VARCHAR(255),
                    tel VARCHAR(255)
                );",
                "CREATE TABLE USERS_PROFILES (
                    id_user INT PRIMARY KEY,
                    photo VARCHAR(255),
                    gender VARCHAR(10),
                    goal TEXT,
                    birth_date DATE,
                    cooking_skill INT,
                    diet_type VARCHAR(255),
                    food_allergies TEXT,
                    FOREIGN KEY (id_user) REFERENCES USERS(id)
                        ON UPDATE CASCADE ON DELETE CASCADE
                );",
                "CREATE TABLE USERS_INGREDIENTS (
                    id_user INT,
                    id_ingredient INT,
                    units VARCHAR(50),
                    quantity DECIMAL(10,2),
                    PRIMARY KEY (id_user, id_ingredient),
                    FOREIGN KEY (id_user) REFERENCES USERS(id)
                        ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (id_ingredient) REFERENCES INGREDIENTS(id)
                        ON UPDATE CASCADE ON DELETE CASCADE
                );"
            ];
            $insertSql = [
                "USE Recipe;",
                "INSERT INTO RECIPES (id, instructions, tags, description, photo, video) VALUES
                (1, 'Mix and bake at 350 degrees for 20 minutes.', 'dessert;easy', 'Chocolate Chip Cookies', 'photo1.jpg', 'video1.mp4'),
                (2, 'Boil for 10 minutes and serve hot.', 'main course;vegan', 'Vegetable Soup', 'photo2.jpg', 'video2.mp4'),
                (3, 'Fry with onions and spices.', 'appetizer;spicy', 'Spicy Chicken Wings', 'photo3.jpg', 'video3.mp4'),
                (4, 'Blend until smooth and chill.', 'beverage;healthy', 'Fruit Smoothie', 'photo4.jpg', 'video4.mp4'),
                (5, 'Grill for 5 minutes each side.', 'main course;quick', 'Grilled Salmon', 'photo5.jpg', 'video5.mp4');
                ",
                "INSERT INTO INGREDIENTS (id, name, brand, category, photo, kcal, macros) VALUES
                (1, 'Flour', 'King Arthur', 'Baking', 'ingr1.jpg', 100, 'carbs: 76g'),
                (2, 'Sugar', 'Domino', 'Baking', 'ingr2.jpg', 110, 'carbs: 100g'),
                (3, 'Egg', 'Organic Valley', 'Dairy', 'ingr3.jpg', 70, 'protein: 6g'),
                (4, 'Milk', 'Horizon', 'Dairy', 'ingr4.jpg', 50, 'protein: 3g, fat: 2g'),
                (5, 'Chicken', 'Tyson', 'Meat', 'ingr5.jpg', 250, 'protein: 30g');
                ",
                "INSERT INTO RECIPES_INGREDIENTS (id_ingredient, id_recipe, quantity) VALUES
                (1, 1, 2.5), -- 2.5 units of Flour for Chocolate Chip Cookies
                (2, 1, 1.5), -- 1.5 units of Sugar for Chocolate Chip Cookies
                (3, 1, 2),   -- 2 Eggs for Chocolate Chip Cookies
                (3, 3, 3),   -- 3 Eggs for Spicy Chicken Wings
                (5, 3, 4);   -- 4 units of Chicken for Spicy Chicken Wings
                ",
                "INSERT INTO USERS (id, name, surname, email, pwd, admin, confirmed, token, address, tel) VALUES
                (1, 'John', 'Doe', 'john.doe@example.com', 'hashpwd1', FALSE, TRUE, 'token1', '123 Elm St', '555-0101'),
                (2, 'Jane', 'Smith', 'jane.smith@example.com', 'hashpwd2', TRUE, TRUE, 'token2', '456 Maple St', '555-0202'),
                (3, 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashpwd3', FALSE, TRUE, 'token3', '789 Oak St', '555-0303'),
                (4, 'Bob', 'Williams', 'bob.williams@example.com', 'hashpwd4', TRUE, FALSE, 'token4', '101 Pine St', '555-0404'),
                (5, 'Carol', 'Brown', 'carol.brown@example.com', 'hashpwd5', FALSE, TRUE, 'token5', '202 Birch St', '555-0505');
                ",
                "INSERT INTO USERS_PROFILES (id_user, photo, gender, goal, birth_date, cooking_skill, diet_type, food_allergies) VALUES
                (1, 'profile1.jpg', 'Male', 'Gain muscle', '1980-01-01', 3, 'Balanced', 'None'),
                (2, 'profile2.jpg', 'Female', 'Lose weight', '1985-02-02', 4, 'Vegan', 'Gluten'),
                (3, 'profile3.jpg', 'Female', 'Maintain weight', '1990-03-03', 5, 'Vegetarian', 'Peanuts'),
                (4, 'profile4.jpg', 'Male', 'Gain muscle', '1975-04-04', 2, 'Keto', 'None'),
                (5, 'profile5.jpg', 'Female', 'Lose weight', '1988-05-05', 4, 'Paleo', 'Dairy');
                ",
                "INSERT INTO USERS_INGREDIENTS (id_user, id_ingredient, units, quantity) VALUES
                (1, 1, 'bag', 1),
                (1, 3, 'dozen', 1),
                (2, 4, 'gallon', 1),
                (3, 5, 'pound', 2),
                (4, 2, 'bag', 2);
                "
            ];
            // Ejecutar las consultas de inserción de datos
            ejecutarSentencias($conexion, $createSql);
            ejecutarSentencias($conexion, $insertSql);
            $bd->cerrar();
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}
function ejecutarSentencias($conexion, $sentencias)
{
    foreach ($sentencias as $sql) {
        if (mysqli_multi_query($conexion, $sql)) {
            do {
                // Almacenar primer resultado set (si existe)
                if ($result = mysqli_store_result($conexion)) {
                    mysqli_free_result($result);
                }
                // Verificar si hay más resultados
            } while (mysqli_next_result($conexion));
            echo "Tablas y datos creados";
        } else {
            echo "Error ejecutando SQL: " . mysqli_error($conexion);
            break; // Salir del bucle en caso de error
        }
    }
}
// Crea tablas e inserta datos solo si no existe Ambulatorio
if (!existeRecipe()) {
    crearBD();
}
