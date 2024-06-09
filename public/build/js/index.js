document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('busqueda');
    const searchIcon = document.querySelector('.search-icon');
    const filterButtons = document.querySelectorAll('.category_container .category');

    function initializeLocalStorage() {
        const defaultFilters = {
            query: '',
            Mexican: false,
            Italian: false,
            Indian: false,
            Chinese: false,
            dietType: '',
            egg: false,
            nuts: false,
            gluten: false,
            seafood: false,
            lactose: false
        };

        const savedFilters = JSON.parse(localStorage.getItem('recipeFilters')) || defaultFilters;

        // If localStorage does not exist, set it with default values
        if (!localStorage.getItem('recipeFilters')) {
            localStorage.setItem('recipeFilters', JSON.stringify(defaultFilters));
        } else {
            // Update localStorage with new default values if they do not exist
            Object.keys(defaultFilters).forEach(key => {
                if (!(key in savedFilters)) {
                    savedFilters[key] = defaultFilters[key];
                }
            });
            localStorage.setItem('recipeFilters', JSON.stringify(savedFilters));
        }
    }

    function fetchUserData() {
        fetch('../../api/get_user_data.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.userData);
                    const savedFilters = JSON.parse(localStorage.getItem('recipeFilters')) || {};
                    savedFilters.dietType = data.dietType;
                    savedFilters.egg = data.allergies.egg;
                    savedFilters.nuts = data.allergies.nuts;
                    savedFilters.gluten = data.allergies.gluten;
                    savedFilters.seafood = data.allergies.seafood;
                    savedFilters.lactose = data.allergies.lactose;
                    localStorage.setItem('recipeFilters', JSON.stringify(savedFilters));
                } else if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    console.error('Error fetching user data:', data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Initialize local storage with default values
    initializeLocalStorage();

    // Fetch user data and update local storage
    fetchUserData();

    // Manejar el envío del formulario de búsqueda
    searchIcon.addEventListener('click', function () {
        const query = searchInput.value;
        let filters = JSON.parse(localStorage.getItem('recipeFilters')) || {};
        filters.query = query;
        localStorage.setItem('recipeFilters', JSON.stringify(filters));
        if (query) {
            const url = `/recipe-discovery`;
            window.location.href = url;
        }
    });

    // Manejar los clics en los botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = button.getAttribute('data-filter');
            let filters = JSON.parse(localStorage.getItem('recipeFilters')) || {};
            filters[filter] = !filters[filter]; // Toggle the filter value
            localStorage.setItem('recipeFilters', JSON.stringify(filters));
            const url = `/recipe-discovery`;
            window.location.href = url;
        });
    });
});
