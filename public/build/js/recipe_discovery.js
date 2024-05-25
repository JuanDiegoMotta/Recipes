document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const filters = document.querySelectorAll('.filters input');

    function updateResults(data) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.results) {
            data.results.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe-card'); // Agrega la clase CSS al div de la receta
                recipeDiv.setAttribute('data-id', recipe.id); // Agrega el atributo data-id con el ID de la receta
                recipeDiv.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <img src="${recipe.image}" alt="${recipe.title}">
                `;
                resultsDiv.appendChild(recipeDiv);
            });
        } else {
            resultsDiv.innerHTML = '<p>No recipes found.</p>';
        }
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

});
