document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const filters = document.querySelectorAll('.filters input');

    // Función para actualizar los resultados en el DOM
    function updateResults(data) {
        console.log(data); // Log the data to inspect the structure

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.results) {
            data.results.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe_card'); // Agrega la clase CSS al div de la receta
                recipeDiv.setAttribute('data-id', recipe.id); // Agrega el atributo data-id con el ID de la receta

                // Inicialmente muestra solo el título y la imagen
                recipeDiv.innerHTML = `
                    <div class='card_image'>
                    <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                    `;
                resultsDiv.appendChild(recipeDiv);

                // Hacer la solicitud para obtener los detalles de la receta
                fetch(`${window.location.origin}/recipe-discovery?id=${recipe.id}`)
                    .then(response => response.json())
                    .then(details => {

                        console.log(details);

                        let textoLargo = details.summary;
                        let textoCorto = stripHTML(textoLargo).substring(0, 150) + "...";

                         // Obtener las calorías de los detalles de la receta
                         const calories = details.nutrition?.nutrients.find(nutrient => nutrient.name === 'Calories')?.amount || 0;

                        recipeDiv.innerHTML += `
                            <div class='card_details'>
                                <div class='inner_card_details1'>
                                    <h4>${recipe.title}</h4>
                                    <p>${textoCorto}</p>
                                    <div class="intolerances" id="intolerances">
                                        
                                    </div>
                                </div>
                                <div class='inner_card_details2'>
                                    <div class='box'>
                                        <span><i class="material-icons">access_time</i> <br> <span id="readyInMinutes">${details.readyInMinutes}</span> min</span>
                                    </div>
                                    <div class='box'>
                                        <span><i class="material-icons">restaurant</i> <br> <span id="servings">${details.servings}</span> servings</span>
                                    </div>
                                    <div class='box'>
                                        <span><i class="material-icons">flash_on</i> <br> <span id="calories">${calories}</span> kcal</span>
                                    </div>
                                </div>
                            </div>
                            `;
                    })
                    .catch(error => {
                        console.error('Error fetching recipe details:', error);
                    });
            });
        } else {
            resultsDiv.innerHTML = '<p>No recipes found.</p>';
        }
    }

    // Función para manejar el cambio de filtros y buscar recetas
    function handleFilterChange() {
        const query = document.getElementById('query').value;
        const sort = document.querySelector('input[name="sort"]:checked')?.value || '';
        const types = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(el => el.value);
        const cuisines = Array.from(document.querySelectorAll('input[name="cuisine"]:checked')).map(el => el.value);
        const diets = Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(el => el.value);
        const intolerances = Array.from(document.querySelectorAll('input[name="intolerances"]:checked')).map(el => el.value);
        const includeIngredients = Array.from(document.querySelectorAll('input[name="includeIngredients"]:checked')).map(el => el.value);

        const params = new URLSearchParams({
            query,
            sort,
            type: types.join(','),
            cuisine: cuisines.join(','),
            diet: diets.join(','),
            intolerances: intolerances.join(','),
            includeIngredients: includeIngredients.join(',')
        });

        const url = `${window.location.origin}/recipe-discovery?${params.toString()}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                updateResults(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    if (searchForm) {
        filters.forEach(filter => {
            filter.addEventListener('change', handleFilterChange);
        });

        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFilterChange();
        });
    }

    function stripHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }
});
