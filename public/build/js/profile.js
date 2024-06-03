document.addEventListener('DOMContentLoaded', function() {
    const showMenuButton = document.getElementById('showMenuButton');
    const wrapperMenu = document.querySelector('.wrapper_menu');
  
    showMenuButton.addEventListener('click', function() {
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
  });