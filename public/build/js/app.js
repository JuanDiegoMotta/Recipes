console.log('hola');
// Cart stuff
let cart_items = [];
const addToCart = document.querySelector('.cart__items');
const cart_img = document.querySelector('.shopping__cart-img-div');
const cart = document.querySelector('.cart');
const cartReset = document.querySelector('.cart__reset');
const contador = document.querySelector('.contador');
const increaseQuantity = document.querySelector('.cart__item-quantity') || null;

// Menu stuff
const menu = document.querySelector('.menu-img');
const main = document.querySelector('main');

window.addEventListener('DOMContentLoaded', () => {
    eventListeners();

    // Load cart from local storage
    cart_items = JSON.parse(localStorage.getItem('cart')) || [];
    printCart();
})

function eventListeners() {
    // Open menu on mouseover and click
    menu.addEventListener('mouseover', openMenu);
    menu.addEventListener('click', openMenu);

    // Close menu on clicking outside
    document.addEventListener('click', closeMenu);
    document.addEventListener('touchstart', closeMenu);
    // Close cart on clicking outside
    document.addEventListener('click', closeCart);
    document.addEventListener('touchstart', closeCart);

    // Cart event listener to delete items
    addToCart.addEventListener('click', (e) => {
        deleteCart(e, 'cart');
    });

    // Shows the cart
    cart_img.addEventListener('click', (e) => {
        e.stopPropagation();
        cart.classList.toggle('none');
    })

    cartReset.addEventListener('click', () => {
        cart_items = [];
        syncStorage();
        emptyCart();
        actualizarContador();
    });

    // Increase or decrease product quantity
    addToCart.addEventListener('change', increaseProductQuanity);
    logout();
}

// Opens the nav menu
function openMenu(event) {
    event.stopPropagation();
    const nav = document.querySelector('.sub-menu');
    nav.classList.add('visible');
    
    // Add event listener for mouse leave
    nav.addEventListener('mouseleave', () => {
        nav.classList.remove('visible');
    });
}

// Closes the nav menu
function closeMenu(event) {
    const nav = document.querySelector('.sub-menu');
    const menu = document.querySelector('.menu-img');

    if (!nav.contains(event.target) && !menu.contains(event.target)) {
        nav.classList.remove('visible');
    }
}

// Deletes item from cart
function deleteCart(event, entity) {
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('cart__item-delete')) {
        const itemId = event.target.getAttribute('data-id');
        cart_items = cart_items.filter(item => item.id !== itemId);
        if(entity === 'checkout') {
            printCheckout();

        } else if(entity === 'cart') {
            printCart();
        }
    }

}

// Shows the cart on the screen
function printCart() {

    emptyCart();

    cart_items.forEach(item => {
        const { id, name, price, quantity, img } = item;
        const card = document.createElement('div');
        card.classList.add('cart__item');
        card.innerHTML = `
            <div class="cart__item">
                <img class="cart__item-img" src="${img}" alt="">
                <div class="flex-1">
                    <p class="cart__item-name">${name}</p>
                    <div class="flex gap-20 align-center">
                        <p class="cart__item-price">${price}</p>
                        <input type="number" name="quantity" id="quantity" min="1" max="10" value="${quantity}" class="cart__item-quantity ml-20">
                    </div>
                </div>
                <svg data-id="${id}" class="cart__item-delete" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#242E3B"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </div> <!-- .cart__item -->
        `;

        addToCart.appendChild(card);
    });

    syncStorage();
    actualizarContador();
}

// Empties the cart html
function emptyCart() {
    while (addToCart.firstChild) {
        addToCart.removeChild(addToCart.firstChild);
    }
}

// Updates the cart counter
function actualizarContador() {
    let cantidad = cart_items.length;
    contador.textContent = cantidad;

    if(cantidad > 0) {
        contador.classList.remove('none');
    } else {
        contador.classList.add('none');
    }
}

// Syncs the cart with local storage
function syncStorage() {    
    localStorage.setItem('cart', JSON.stringify(cart_items));
}

function closeCart(e) {
    if(e.target !== cart_img && e.target !== cart && !cart.contains(e.target) && !cart_img.contains(e.target)) {
        cart.classList.add('none');
    }
}

function increaseProductQuanity(event) {
    if(event.target.classList.contains('cart__item-quantity')) {
        console.log('aumentando o disminuyendo...');
        console.log(event.target.value);
        // Navigate to the parent <div> of the cart item
        const cartItemDiv = event.target.closest('.cart__item');

        // Find the <svg> element within that parent <div>
        const svgElement = cartItemDiv.querySelector('.cart__item-delete');

        // Get the data-id attribute from the <svg> element
        const itemId = svgElement.getAttribute('data-id');

        // Find the item in the cart items array
        const item = cart_items.find(item => item.id === itemId);

        // Update the quantity
        item.quantity = parseInt(event.target.value);

        // Update the cart array with the updated item and quantity
        const updatedCart = cart_items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity: parseInt(event.target.value)
                };
            }
            return item;
        });

        // Update the cart_items array with the updated cart
        cart_items = updatedCart;

        // Print the cart
        printCart();
    }
}
function logout() {
    if(document.getElementById('logout_option')){
        console.log('Existelogout-option');
        document.getElementById('logout_option').addEventListener('click', function() {
            console.log('se clica logout');
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
    }else{
        console.log('user is not logged in');
    }

  }