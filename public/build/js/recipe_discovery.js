document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const filters = document.querySelectorAll('.filters input');

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

    
    function updateFormWithFilters() {
        const savedFilters = JSON.parse(localStorage.getItem('recipeFilters'));
        let input = document.getElementById("query");
        let checkbox1 = document.getElementById("italian");
        let checkbox2 = document.getElementById("mexican");
        let checkbox3 = document.getElementById("chinese");
        let checkbox4 = document.getElementById("indian");

        if (savedFilters) {
            if (savedFilters.query) {
                input.value = savedFilters.query;
            }

            if (savedFilters.Italian == true) {
                checkbox1.checked = true;
            }

            if (savedFilters.Mexican == true) {
                checkbox2.checked = true;
            }

            if (savedFilters.Chinese == true) {
                checkbox3.checked = true;
            }

            if (savedFilters.Indian == true) {
                checkbox4.checked = true;
            }
        }
    }

    function removeRecipeFilters() {
        localStorage.removeItem('recipeFilters');
    }

    function updateResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
    
        if (data.results) {
            data.results.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe_card');
                recipeDiv.setAttribute('data-id', recipe.id);
    
                recipeDiv.innerHTML = `
                    <div class='card_image'>
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                `;
                resultsDiv.appendChild(recipeDiv);
    
                recipeDiv.addEventListener('click', (event) => {
                    if (!event.target.classList.contains('heart-icon')) {
                        window.location.href = `/recipe?id=${recipe.id}`;
                    }
                });
    
                fetch(`${window.location.origin}/recipe-discovery?id=${recipe.id}`)
                    .then(response => response.json())
                    .then(details => {
                        let textoLargo = details.summary;
                        let textoCorto = stripHTML(textoLargo).substring(0, 150) + "...";
                        
                        recipeDiv.innerHTML += `
                            <div id='heart_container'><span class="material-icons heart-icon" id="heart-${recipe.id}">favorite_border</span></div>
                            <div class='card_details'>
                                <div class='inner_card_details1'>
                                    <h4>${recipe.title}</h4>
                                    <p>${textoCorto}</p>
                                    <div class="intolerances" id="intolerances-${recipe.id}"></div>
                                </div>
                                <div class='inner_card_details2'>
                                    <div class='box'>
                                        <span><i class="material-icons">access_time</i> <br> <span id="readyInMinutes">${details.readyInMinutes}</span> min</span>
                                    </div>
                                    <div class='box'>
                                        <span><i class="material-icons">restaurant</i> <br> <span id="servings">${details.servings}</span> servings</span>
                                    </div>
                                    <div class='box'>
                                        <span><i class="material-icons">flash_on</i> <br> <span id="calories-${recipe.id}">Loading...</span></span>
                                    </div>
                                </div>
                            </div>
                        `;
    
                        // Hacer la petición para obtener la información nutricional
                        fetch(`https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(details.title)}&apiKey=28c4f267e39645c8a506c6393b04a3ea`)
                            .then(nutritionResponse => nutritionResponse.json())
                            .then(nutrition => {
                                const calories = nutrition.calories ? nutrition.calories.value : "N/A";
                                document.getElementById(`calories-${recipe.id}`).innerText = calories + " kcal";
                            })
                            .catch(error => {
                                console.error('Error fetching nutrition details:', error);
                                document.getElementById(`calories-${recipe.id}`).innerText = 'N/A kcal';
                            });
    
                        displayIntolerances(details.extendedIngredients, `intolerances-${recipe.id}`);
                        heartIconListeners(); // Agregar los listeners de los corazones después de actualizar los detalles
                    })
                    .catch(error => {
                        console.error('Error fetching recipe details:', error);
                    });
            });
    
        } else {
            resultsDiv.innerHTML = '<p>No recipes found.</p>';
        }
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

    updateFormWithFilters();
    handleFilterChange();
    removeRecipeFilters();

    function stripHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    function heartIconListeners() {
        fetch('../../api/get_favorites.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const favoriteRecipes = data.favorites;

                    favoriteRecipes.forEach(recipeId => {
                        const heartIcon = document.getElementById(`heart-${recipeId}`);
                        if (heartIcon) {
                            heartIcon.textContent = 'favorite';
                        }
                    });

                    const heartIcons = document.querySelectorAll('.heart-icon');
                    heartIcons.forEach(heartIcon => {
                        heartIcon.removeEventListener('click', handleHeartClick);
                        heartIcon.addEventListener('click', handleHeartClick);
                    });
                } else {
                    const heartIcons = document.querySelectorAll('.heart-icon');
                    heartIcons.forEach(heartIcon => {
                        heartIcon.addEventListener('click', goToLogin);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function goToLogin(){
        window.location.href = "/login";
    }

    function handleHeartClick(event) {
        event.stopPropagation();
        event.preventDefault();

        const heartIcon = event.currentTarget;
        const recipeCard = heartIcon.closest('.recipe_card');
        const recipeId = recipeCard.getAttribute('data-id');

        fetch('../../api/add_favorites.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ api_id: recipeId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    heartIcon.textContent = data.isFavorite ? 'favorite' : 'favorite_border';
                } else if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    console.log(data.message);
                }
            })
            .catch(window.redirect.href = "/login");
    }

    const recipeCards = document.querySelectorAll('.recipe_card');

    recipeCards.forEach(recipeCard => {
        recipeCard.addEventListener('click', function (event) {
            if (event.target.classList.contains('heart-icon')) {
                event.stopImmediatePropagation();
                return;
            } else {
                const recipeId = this.getAttribute('data-id');
                window.location.href = `/recipe/${recipeId}`;
            }
        });
    });

    heartIconListeners();
});
