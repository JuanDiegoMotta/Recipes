document.addEventListener('DOMContentLoaded', function () {
    initializeMenu();
    initializeSectionBar();
    fetchFavoriteRecipes(); // Llama a la función para obtener y mostrar las recetas favoritas
    setupLogout();
});

function initializeMenu() {
    const showMenuButton = document.getElementById('showMenuButton');
    const wrapperMenu = document.querySelector('.wrapper_menu');

    showMenuButton.addEventListener('click', function () {
        wrapperMenu.style.display = 'flex';
        wrapperMenu.style.position = 'absolute';
        wrapperMenu.style.left = '0';
        wrapperMenu.style.top = '12%';
        wrapperMenu.style.height = '81%';
        wrapperMenu.style.zIndex = '1000';
        wrapperMenu.style.boxShadow = 'var(--shadow_strong)';

        document.addEventListener('click', function closeMenu(event) {
            if (!wrapperMenu.contains(event.target) && event.target !== showMenuButton) {
                wrapperMenu.style.display = 'none';
                document.removeEventListener('click', closeMenu);
            }
        });
    });
}

function initializeSectionBar() {
    const titles = document.querySelectorAll('.wrapper_titles .title');

    titles.forEach((title, index) => {
        title.addEventListener('click', function () {
            document.querySelector('.current_title').classList.remove('current_title');
            title.classList.add('current_title');

            moveGreenLine(index);
        });
    });
}

function moveGreenLine(index) {
    const greenLine = document.querySelector('.green_line');
    const positions = ['0%', '38.5%', '79%'];
    greenLine.style.left = positions[index];
}

function fetchFavoriteRecipes() {
    fetch('../../api/get_favorites.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const favoriteApiIds = data.favorites;
            fetchRecipesDetails(favoriteApiIds);
        } else {
            console.error('Error fetching favorite recipes:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchRecipesDetails(apiIds) {
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = ''; // Limpiar contenido previo

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('favorites_container');
    contentDiv.appendChild(containerDiv);

    apiIds.forEach(apiId => {
        fetch(`${window.location.origin}/recipe-discovery?id=${apiId}`)
        .then(response => response.json())
        .then(recipe => {
            displayFavoriteRecipe(recipe, containerDiv);
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
    });
}

function displayFavoriteRecipe(recipe, containerDiv) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe_card');
    recipeDiv.setAttribute('data-id', recipe.id);

    let textoLargo = recipe.summary;
    let textoCorto = stripHTML(textoLargo).substring(0, 150) + "...";
    const calories = recipe.nutrition?.nutrients.find(nutrient => nutrient.name === 'Calories')?.amount || 0;

    recipeDiv.innerHTML = `
        <div id='heart_container'><span class="material-icons heart-icon" id="heart-${recipe.id}">favorite</span></div>
        <div class='card_image'>
            <img src="${recipe.image}" alt="${recipe.title}">
        </div>
        <div class='card_details'>
            <div class='inner_card_details1'>
                <h4>${recipe.title}</h4>
                <p>${textoCorto}</p>
            </div>
            <div class='inner_card_details2'>
                <div class='box'>
                    <span><i class="material-icons">access_time</i> <br> <span id="readyInMinutes">${recipe.readyInMinutes}</span> min</span>
                </div>
                <div class='box'>
                    <span><i class="material-icons">restaurant</i> <br> <span id="servings">${recipe.servings}</span> servings</span>
                </div>
                <div class='box'>
                    <span><i class="material-icons">flash_on</i> <br> <span id="calories">${calories}</span> kcal</span>
                </div>
            </div>
        </div>
    `;

    recipeDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('heart-icon')) {
            handleHeartClick(event);
        } else {
            window.location.href = `/recipe?id=${recipe.id}`;
        }
    });

    containerDiv.appendChild(recipeDiv);
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
            if (!data.isFavorite) {
                recipeCard.remove();
            }
        } else if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            console.error('Error adding/removing favorite:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function stripHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}
function setupLogout() {
    document.getElementById('logOut').addEventListener('click', function() {
      fetch('../../api/cerrar_sesion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redirigir a la página de inicio
          window.location.href = '/';
        } else {
          console.error('Error al cerrar sesión:', data.message);
          alert('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
      });
    });
  }