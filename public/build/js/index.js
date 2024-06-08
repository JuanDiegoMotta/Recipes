document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('busqueda');
    const searchIcon = document.querySelector('.search-icon');
    const filterButtons = document.querySelectorAll('.category_container .category');

    // Manejar el envío del formulario de búsqueda
    searchIcon.addEventListener('click', function () {
        const query = searchInput.value;
        const filters = {
            query: query,
            Mexican: false,
            Italian: false,
            Indian: false,
            Chinese: false
        };
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
            let filters = JSON.parse(localStorage.getItem('recipeFilters')) || {
                query: '',
                Mexican: false,
                Italian: false,
                Indian: false,
                Chinese: false
            };
            filters[filter] = true;
            localStorage.setItem('recipeFilters', JSON.stringify(filters));
            const url = `/recipe-discovery`;
            window.location.href = url;
        });
    });
});