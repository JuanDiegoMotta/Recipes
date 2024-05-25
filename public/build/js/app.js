document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
});

function eventListeners() {
    const menu = document.querySelector('.menu-img');
    const main = document.querySelector('main');

    // Open menu on mouseover and click
    menu.addEventListener('mouseover', openMenu);
    menu.addEventListener('click', openMenu);

    // Close menu on clicking outside
    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu);
}

function openMenu(event) {
    event.stopPropagation();
    const nav = document.querySelector('.sub-menu');
    nav.classList.add('visible');
    
    // Add event listener for mouse leave
    nav.addEventListener('mouseleave', () => {
        nav.classList.remove('visible');
    });
}

function closeMenu(event) {
    const nav = document.querySelector('.sub-menu');
    const menu = document.querySelector('.menu-img');

    if (!nav.contains(event.target) && !menu.contains(event.target)) {
        nav.classList.remove('visible');
    }
}

//JS de recipe discovery


