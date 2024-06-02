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
                const ingredients = details.extendedIngredients.map(ingredient => ingredient.original);
                const instructions = details.instructions;

                // Obtener información nutricional usando el título de la receta
                fetch(`https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(title)}&apiKey=5150b11e51f7451cab0fc41f6188faa5`)
                    .then(nutritionResponse => nutritionResponse.json())
                    .then(nutrition => {
                        const calories = nutrition.calories.value;
                        const fat = nutrition.fat.value;
                        const protein = nutrition.protein.value;
                        const carbs = nutrition.carbs.value;

                        // Mostrar los datos en la página
                        const detailsDiv = document.getElementById('recipe-details');
                        detailsDiv.innerHTML = `
                            <h1>${title}</h1>
                            <img src="${image}" alt="${title}">
                            <p>${summary}</p>
                            <div class="recipe-info">
                                <p><strong>Serves:</strong> ${servings}</p>
                                <p><strong>Prep Time:</strong> ${readyInMinutes} min</p>
                            </div>
                            <div class="nutrition">
                                <div><strong>Calories:</strong> ${calories}</div>
                                <div><strong>Fat:</strong> ${fat}g</div>
                                <div><strong>Protein:</strong> ${protein}g</div>
                                <div><strong>Carbs:</strong> ${carbs}g</div>
                            </div>
                            <div class="allergens" id="intolerances-${recipeId}">
                                <h3>Allergens</h3>
                            </div>
                            <div class="ingredients">
                                <h3>Ingredients</h3>
                                <ul>
                                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="instructions">
                                <h3>Instructions</h3>
                                <p>${instructions}</p>
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
            }
        });
    }
});
