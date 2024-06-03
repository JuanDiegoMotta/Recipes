const items_container = document.querySelector('.checkout__left');
const checkoutPrice = document.querySelector('.checkout__price');
const buyButton = document.querySelector('.checkout__buy__button');

window.addEventListener('DOMContentLoaded', () => {
    eventListeners2();
});


function eventListeners2() {

    printCheckout();
    calculatePrice();

    items_container.addEventListener('click', (e) => {
        deleteCart(e, 'checkout');
    });
}



// Empties the cart html
function emptyCheckout() {
    while (items_container.firstChild) {
        items_container.removeChild(items_container.firstChild);
    }
}

function printCheckout() {

    emptyCheckout();

    cart_items.forEach(item => {
        const { id, name, price, quantity, img } = item;
    
        // Create the article element
        const itemContainer = document.createElement('article');
        itemContainer.classList.add('item__container');

        // Create the image container
        const itemImage = document.createElement('div');
        itemImage.classList.add('item__image');
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgElement.alt = `${name} image`;
        itemImage.appendChild(imgElement);

        // Create the info container
        const itemInfo = document.createElement('main');
        itemInfo.classList.add('item__info');

        // Create the item name and description container
        const itemInfoTop = document.createElement('div');
        const itemName = document.createElement('h2');
        itemName.textContent = name;
        const itemDesc = document.createElement('p');
        itemDesc.textContent = 'This is a description of the item.';
        itemInfoTop.appendChild(itemName);
        itemInfoTop.appendChild(itemDesc);

        // Create the bottom info container
        const itemInfoBottom = document.createElement('div');
        itemInfoBottom.classList.add('item__info-bottom');
        const itemPrice = document.createElement('p');
        itemPrice.textContent = price;

        const itemMisc = document.createElement('div');
        itemMisc.classList.add('item__misc');

        // Create the quantity select element
        const selectElement = document.createElement('select');
        selectElement.name = 'quantity';
        selectElement.id = 'quantity';
        for (let i = 1; i <= 4; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === quantity) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        }

        // Create the SVG icons
        const favoriteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        favoriteIcon.setAttribute('height', '24px');
        favoriteIcon.setAttribute('viewBox', '0 -960 960 960');
        favoriteIcon.setAttribute('width', '24px');
        favoriteIcon.setAttribute('fill', '#5f6368');
        favoriteIcon.innerHTML = '<path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>';

        const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        deleteIcon.classList.add('cart__item-delete');
        deleteIcon.setAttribute('data-id', id);
        deleteIcon.setAttribute('height', '24px');
        deleteIcon.setAttribute('viewBox', '0 -960 960 960');
        deleteIcon.setAttribute('width', '24px');
        deleteIcon.setAttribute('fill', '#5f6368');
        deleteIcon.innerHTML = '<path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>';

        // Append elements
        itemMisc.appendChild(selectElement);
        itemMisc.appendChild(favoriteIcon);
        itemMisc.appendChild(deleteIcon);

        itemInfoBottom.appendChild(itemPrice);
        itemInfoBottom.appendChild(itemMisc);

        itemInfo.appendChild(itemInfoTop);
        itemInfo.appendChild(itemInfoBottom);

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemInfo);

        // Append the item container to the items container
        items_container.appendChild(itemContainer);
    });

    syncStorage();
}

function calculatePrice() {
    console.log(cart_items);
    let total = 0;
    cart_items.forEach(item => {
        total += parseFloat(item.price) * item.quantity;
    });
    checkoutPrice.textContent = `$${total}`;
}   


/* BUY BUTTON CODE */
document.addEventListener('DOMContentLoaded', () => {
    buyButton.addEventListener('click', function() {
        fetch('/checkout/createSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
        })
        .then(data => {
            console.log(data);
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    });
});

// buyButton.addEventListener('click', buyAction);
// const stripe = Stripe('pk_test_51PH5DxJR9DMxZqlKxFo8rxNeWQf6iqduhwACGhvNaMJSgX6pNJ7fVdFwJDHsJH3IKIzGWyuNYq92Jl0am6RSXkx300YCHaNyNB');

// async function buyAction() {
//     const price = checkoutPrice.textContent;

//     const response = await fetch('/api/create-checkout-session.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             amount: price * 100, // Convert to cents
//         }),
//     });

//     const session = await response.json();

//     const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
//     if (error) {
//         console.error('Error:', error);
//         alert('Payment failed. Please try again.');
//     }
// }

