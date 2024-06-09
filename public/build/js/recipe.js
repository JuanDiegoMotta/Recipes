document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    const intoleranceIcons = {
        Dairy: 'local_cafe',
        Egg: 'egg',
        Gluten: 'grain',
        Grain: 'grain',
        Peanut: 'restaurant',
        Seafood: 'set_meal',
        Sesame: 'restaurant',
        Shellfish: 'restaurant',
        Soy: 'spa',
        Sulfite: 'science',
        'Tree Nut': 'park',
        Wheat: 'bakery_dining'
    };

    const intoleranceKeywords = {
        Dairy: ['milk', 'cheese', 'butter', 'cream', 'yogurt'],
        Egg: ['egg'],
        Gluten: ['wheat', 'barley', 'rye', 'oats'],
        Grain: ['rice', 'corn', 'wheat', 'barley', 'oats'],
        Peanut: ['peanut'],
        Seafood: ['fish', 'shrimp', 'lobster', 'crab'],
        Sesame: ['sesame'],
        Shellfish: ['shrimp', 'lobster', 'crab', 'oyster'],
        Soy: ['soy', 'tofu'],
        Sulfite: ['sulfite'],
        'Tree Nut': ['almond', 'cashew', 'walnut', 'pecan'],
        Wheat: ['wheat']
    };

    if (recipeId) {
        fetch(`/recipe-discovery?id=${recipeId}`)
            .then(response => response.json())
            .then(details => {
                // Variables para almacenar los datos
                const title = details.title;
                const image = details.image;
                const summary = details.summary;
                const readyInMinutes = details.readyInMinutes;
                const servings = details.servings;
                const healthScore = details.healthScore;
                const ingredients = details.extendedIngredients.map(ingredient => ingredient.original);
                const instructions = details.instructions;

                // Obtener información nutricional usando el título de la receta
                fetch(`https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(title)}&apiKey=1091b27593f94a5891339e9a6b98b1c1`)
                    .then(nutritionResponse => nutritionResponse.json())
                    .then(nutrition => {
                        const calories = nutrition.calories ? nutrition.calories.value : "N/A";
                        const fat = nutrition.fat ? nutrition.fat.value+"g" : "N/A";
                        const protein = nutrition.protein ? nutrition.protein.value+"g" : "N/A";
                        const carbs = nutrition.carbs ? nutrition.carbs.value+"g" : "N/A";

                        // Mostrar los datos en la página
                        const detailsDiv = document.getElementById('recipe-details');
                        detailsDiv.innerHTML = `
                            <h1 class='title'>${title}</h1>
                            <img src="${image}" alt="${title}">
                            <p class='summary'>${summary}</p>
                            <div class="recipe-info">
                                <div class='box1'><p><i class="material-icons iconos1">restaurant</i> <span>${servings}</span></p></div>
                                <div class='box1'><p><i class="material-icons iconos1">access_time</i> ${readyInMinutes} min</p></div>
                                <div class='box1'><p><i class="material-icons iconos1">star</i> ${healthScore}</p> </div>
                            </div>
                            <div class="nutrition">
                                <div class='datos'>
                                    <p class='texto1'><i class="material-icons iconos2 calorias">local_fire_department</i> Calories</p> 
                                    <p class='texto2'>${calories}</p>
                                </div>
                                <div class='datos'>
                                    <p class='texto1'><i class="material-icons iconos2 grasas">opacity</i> Fat</p>
                                    <p class='texto2'>${fat}</p>
                                </div>
                                <div class='datos'>
                                    <p class='texto1'><i class="material-icons iconos2 proteina">fitness_center</i> Protein</p>
                                    <p class='texto2'>${protein}</p>
                                </div>
                                <div class='datos'>
                                    <p class='texto1'><i class="material-icons iconos2 carbohidratos">grain</i> Carbs</p>
                                    <p class='texto2'>${carbs}</p>
                                </div>
                            </div>
                            <div class='waves'></div>
                            <div class='allergens-container' id='allergens-container'>
                                <div class="allergens">
                                    <h3>Allergens</h3>
                                    <div id='intolerances-${recipeId}' class='intolerance-container'></div>
                                </div>
                            </div>
                            <div class='ingredients-container'>
                                <div class="ingredients">
                                    <h3>Ingredients</h3>
                                    <ul>
                                        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            <div class='instructions-container'>
                                <div class="instructions">
                                    <h3>Instructions</h3>
                                    <p>${instructions}</p>
                                </div>
                            </div>
                            <div class='enjoy-container'>
                                <h1 class='enjoy-text'>Enjoy!</h1>  
                            </div>
                        `;

                        // Mostrar intolerancias
                        displayIntolerances(details.extendedIngredients, `intolerances-${recipeId}`);
                    })
                    .catch(error => {
                        console.error('Error fetching nutrition details:', error);
                        document.getElementById('recipe-details').innerHTML += '<p>Nutrition information not available.</p>';
                    });
            })
            .catch(error => {
                console.error('Error fetching recipe details:', error);
                document.getElementById('recipe-details').innerHTML = '<p>Recipe not found.</p>';
            });
    } else {
        document.getElementById('recipe-details').innerHTML = '<p>Recipe not found.</p>';
    }

    function displayIntolerances(ingredients, containerId) {
        const intolerancesDiv = document.getElementById(containerId);
        const foundIntolerances = [];

        ingredients.forEach(ingredient => {
            for (const [intolerance, keywords] of Object.entries(intoleranceKeywords)) {
                if (keywords.some(keyword => ingredient.name.toLowerCase().includes(keyword.toLowerCase()))) {
                    if (!foundIntolerances.includes(intolerance)) {
                        foundIntolerances.push(intolerance);
                    }
                }
            }
        });

        foundIntolerances.forEach(intolerance => {
            if (intoleranceIcons[intolerance]) {
                const intoleranceElement = document.createElement('div');
                intoleranceElement.className = 'intolerance';
                intoleranceElement.innerHTML = `<i class="material-icons">${intoleranceIcons[intolerance]}</i> ${intolerance}`;
                intolerancesDiv.appendChild(intoleranceElement);
            } else {
                intolerancesDiv.style.display = "none";
            }
        });
    }
});