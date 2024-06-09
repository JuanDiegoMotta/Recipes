document.addEventListener('DOMContentLoaded', function () {
    initializeMenu();
    initializeSectionBar();
});

function initializeMenu() {
    const showMenuButton = document.getElementById('showMenuButton');
    const wrapperMenu = document.querySelector('.wrapper_menu');

    showMenuButton.addEventListener('click', function () {
        wrapperMenu.style.display = 'flex';
        wrapperMenu.style.position = 'absolute';
        wrapperMenu.style.left = '0'; // Asegurarse de que aparezca en el lado izquierdo
        wrapperMenu.style.top = '12%';
        wrapperMenu.style.height = '81%';
        wrapperMenu.style.zIndex = '1000';
        wrapperMenu.style.boxShadow = 'var(--shadow_strong)';

        // Añadir un listener para cerrar el menú cuando se haga clic fuera de él
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
    const forms = document.querySelectorAll('.content form');
    const greenLine = document.querySelector('.green_line');

    titles.forEach((title, index) => {
        title.addEventListener('click', function () {
            // // Cambiar formulario visible
            // forms.forEach(form => form.classList.remove('visible'));
            // forms[index].classList.add('visible');

            // Actualizar estilos de los títulos
            document.querySelector('.current_title').classList.remove('current_title');
            title.classList.add('current_title');

            // Mover la barra verde
            moveGreenLine(index);
        });
    });
}

function moveGreenLine(index) {
    const greenLine = document.querySelector('.green_line');
    const positions = ['0%', '38.5%', '79%']; // Ajusta estas posiciones según sea necesario
    greenLine.style.left = positions[index];
}