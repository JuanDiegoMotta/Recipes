<main>
    <div class="container1">
        <h1>Find Your Next Culinary Adventure</h1>
        <p>Discover delicious recipes from around the world.</p>
        <form id="searchForm" class="searchForm">
            <div class="input_container">
                <span class="material-icons">search</span>
                <input type="text" id="query" name="query" placeholder="Busca recetas...">
            </div>
        </form>
    </div>

    <div class="container_2">
        <div class="inner_container2_1">
            <div class="filters">
                <h4>Ordenar por</h4>
                <label>
                    <input type="radio" name="sort" value="popularity" checked> Popularidad
                </label> <br>
                <label>
                    <input type="radio" name="sort" value="readyInMinutes"> Tiempo de preparación
                </label> <br>
                <label>
                    <input type="radio" name="sort" value="calories"> Calorías
                </label> <br>
                <label>
                    <input type="radio" name="sort" value="healthScore"> Puntuación de salud
                </label>

                <h4>Tipo de Plato</h4>
                <label>
                    <input type="checkbox" name="type" value="breakfast"> Desayuno
                </label>
                <label>
                    <input type="checkbox" name="type" value="lunch"> Almuerzo
                </label> <br>
                <label>
                    <input type="checkbox" name="type" value="dinner"> Cena
                </label>
                <label>
                    <input type="checkbox" name="type" value="snack"> Aperitivo
                </label> <br>
                <label>
                    <input type="checkbox" name="type" value="dessert"> Postre
                </label>
                <label>
                    <input type="checkbox" name="type" value="drink"> Bebida
                </label> <br>

                <h4>Cocina</h4>
                <label>
                    <input type="checkbox" name="cuisine" value="american"> Americana
                </label>
                <label>
                    <input type="checkbox" name="cuisine" value="italian" id="italian"> Italiana
                </label> <br>
                <label>
                    <input type="checkbox" name="cuisine" value="mexican" id="mexican"> Mexicana
                </label> 
                <label>
                    <input type="checkbox" name="cuisine" value="chinese" id="chinese"> China
                </label> <br>
                <label>
                    <input type="checkbox" name="cuisine" value="indian" id="indian"> India
                </label>
                <label>
                    <input type="checkbox" name="cuisine" value="japanese"> Japonesa
                </label> <br>
                <label>
                    <input type="checkbox" name="cuisine" value="french"> Francesa
                </label>

                <h4>Dieta</h4>
                <label>
                    <input type="checkbox" name="diet" value="vegetarian"> Vegetariana
                </label>
                <label>
                    <input type="checkbox" name="diet" value="vegan"> Vegana
                </label> <br>
                <label>
                    <input type="checkbox" name="diet" value="paleo"> Paleo
                </label>
                <label>
                    <input type="checkbox" name="diet" value="keto"> Cetogénica (Keto)
                </label> <br>
                <label>
                    <input type="checkbox" name="diet" value="glutenFree"> Sin gluten
                </label>

                <h4>Intolerancias</h4>
                <label>
                    <input type="checkbox" name="intolerances" value="gluten"> Sin gluten
                </label>
                <label>
                    <input type="checkbox" name="intolerances" value="dairy"> Sin lácteos
                </label> <br>
                <label>
                    <input type="checkbox" name="intolerances" value="egg"> Sin huevo
                </label>
                <label>
                    <input type="checkbox" name="intolerances" value="nut"> Sin frutos secos
                </label> <br>
                <label>
                    <input type="checkbox" name="intolerances" value="soy"> Sin soja
                </label>

                <h4>Ingredientes</h4>
                <label>
                    <input type="checkbox" name="includeIngredients" value="chicken"> Pollo
                </label>
                <label>
                    <input type="checkbox" name="includeIngredients" value="beef"> Carne de res
                </label> <br>
                <label>
                    <input type="checkbox" name="includeIngredients" value="pork"> Cerdo
                </label>
                <label>
                    <input type="checkbox" name="includeIngredients" value="fish"> Pescado
                </label> <br>
                <label>
                    <input type="checkbox" name="includeIngredients" value="seafood"> Mariscos
                </label>
                <label>
                    <input type="checkbox" name="includeIngredients" value="tofu"> Tofu
                </label> <br>
                <label>
                    <input type="checkbox" name="includeIngredients" value="vegetables"> Verduras
                </label>
            </div>
        </div>
        <div class="inner_container2_2" id="results">
        </div>
    </div>
</main>
