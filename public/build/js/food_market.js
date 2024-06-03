const items = [
    {
        id: 1,
        name: 'Chicken Fajita Pasta',
        img: 'example.jpg',
        price: 8.95,
        quantity: 450,
        info: {
            kcal: 550,
            proteins: 43,
            carbs: 36,
            fat: 26,
        }
    },
    {
        id: 2,
        name: 'Spaghetti Carbonara',
        img: 'example.jpg',
        price: 9.95,
        quantity: 400,
        info: {
            kcal: 700,
            proteins: 30,
            carbs: 80,
            fat: 30,
        }
    },
    {
        id: 3,
        name: 'Grilled Chicken Salad',
        img: 'example.jpg',
        price: 7.50,
        quantity: 350,
        info: {
            kcal: 400,
            proteins: 35,
            carbs: 20,
            fat: 15,
        }
    },
    {
        id: 4,
        name: 'Beef Tacos',
        img: 'example.jpg',
        price: 8.00,
        quantity: 300,
        info: {
            kcal: 600,
            proteins: 25,
            carbs: 50,
            fat: 30,
        }
    },
    {
        id: 5,
        name: 'Veggie Burger',
        img: 'example.jpg',
        price: 6.75,
        quantity: 250,
        info: {
            kcal: 450,
            proteins: 20,
            carbs: 60,
            fat: 15,
        }
    },
    {
        id: 6,
        name: 'Chicken Alfredo',
        img: 'example.jpg',
        price: 10.50,
        quantity: 500,
        info: {
            kcal: 800,
            proteins: 45,
            carbs: 70,
            fat: 40,
        }
    },
    {
        id: 7,
        name: 'Margherita Pizza',
        img: 'example.jpg',
        price: 9.00,
        quantity: 450,
        info: {
            kcal: 600,
            proteins: 25,
            carbs: 75,
            fat: 20,
        }
    },
    {
        id: 8,
        name: 'Caesar Salad',
        img: 'example.jpg',
        price: 6.00,
        quantity: 300,
        info: {
            kcal: 350,
            proteins: 15,
            carbs: 10,
            fat: 25,
        }
    },
    {
        id: 9,
        name: 'BBQ Ribs',
        img: 'example.jpg',
        price: 12.00,
        quantity: 550,
        info: {
            kcal: 900,
            proteins: 50,
            carbs: 60,
            fat: 50,
        }
    },
    {
        id: 10,
        name: 'Pancakes with Syrup',
        img: 'example.jpg',
        price: 7.25,
        quantity: 400,
        info: {
            kcal: 500,
            proteins: 10,
            carbs: 90,
            fat: 15,
        }
    },
];

// This code adds the class active which is used to change text color and border-bottom color to green, when u click on the nav item (prepared meals, ingredients)
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
})

// All the code below is for printing dynamically the food market items

// Print the object of items on the screen
const marketDiv = document.querySelector('.market');

items.forEach( item => {

    // Create the main container div
    const marketCard = document.createElement('div');
    marketCard.classList.add('market__card');

    // Create and append the image
    const img = document.createElement('img');
    const baseUrl = '/build/img/food_market/';
    const srcset = `
            ${baseUrl}${item.img}?width=165 165w,
            ${baseUrl}${item.img}?width=360 360w,
            ${baseUrl}${item.img}?width=533 533w,
            ${baseUrl}${item.img}?width=720 720w,
            ${baseUrl}${item.img}?width=800 800w
        `;
    img.classList.add('cart__item-img');
    img.srcset = srcset;
    img.src = `${baseUrl}${item.img}?width=800`;
    img.sizes = `(min-width: 1530px) 350px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)`;
    img.alt = `image of ${item.name}`;
    img.loading = 'lazy';
    img.width = 800;
    img.height = 250;
    
    marketCard.appendChild(img);

    // Create the card container div
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card__container');
    marketCard.appendChild(cardContainer);


    // Create and append the h3 element
    const h3 = document.createElement('h3');
    h3.classList.add('cart__item-name');
    h3.textContent = item.name;
    cardContainer.appendChild(h3);


    // Create and append the weight paragraph
    const quantity = document.createElement('p');
    quantity.classList.add('cart__item-quantity');
    quantity.textContent = `(${item.quantity}g)`;
    cardContainer.appendChild(quantity);


    // Create and append the price paragraph
    const price = document.createElement('p');
    price.classList.add('cart__item-price');
    price.textContent = `$${item.price.toFixed(2)}`;
    cardContainer.appendChild(price);


    // Create the nutritional info container div
    const nutritionalInfo = document.createElement('div');
    nutritionalInfo.classList.add('card__nutritional-info');
    cardContainer.appendChild(nutritionalInfo);


    // Function to create info divs
    function createInfoDiv(value, label) {
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');

        const valueP = document.createElement('p');
        valueP.textContent = value;
        infoDiv.appendChild(valueP);

        const labelP = document.createElement('p');
        labelP.textContent = label;
        infoDiv.appendChild(labelP);

        return infoDiv;
    }


    // Create and append the nutritional info
    nutritionalInfo.appendChild(createInfoDiv(`${item.info.kcal}`, 'kcal'));
    nutritionalInfo.appendChild(createInfoDiv(`${item.info.proteins}g`, 'proteins'));
    nutritionalInfo.appendChild(createInfoDiv(`${item.info.carbs}g`, 'carbs'));
    nutritionalInfo.appendChild(createInfoDiv(`${item.info.fat}g`, 'fat'));


    // Create and append the add to cart link
    const addToCartLink = document.createElement('a');
    addToCartLink.classList.add('card__add');
    addToCartLink.href = '#';
    addToCartLink.dataset.id = item.id;
    addToCartLink.textContent = 'Add to cart';
    cardContainer.appendChild(addToCartLink);


    // Append the whole card to the body or any other container
    marketDiv.appendChild(marketCard);

})


// From now on, the code below is for the filter
const filters_icon = document.querySelector('.filters_icon');
const filters = document.querySelector('.filters');
filters_icon.addEventListener('click', function() {
    filters.classList.toggle('none');
})


// Now we will add the event listener that if filters are shown, whenever we click other spot of the page, the filters will be hidden
document.addEventListener('click', function(event) {
    if (!event.target.closest('.filters') && !event.target.closest('.filters_icon')) {
        filters.classList.add('none');
    }
})


// Cart Stuff
const market = document.querySelector('.market');
market.addEventListener('click', addCart);
function addCart(event) {
    event.preventDefault();

    if (event.target.classList.contains('card__add')) {
        const card = event.target.parentElement.parentElement;
        readData(card);
    }

}


// Read the data from the card
function readData(card) {
    const infoProduct = {
        id: card.querySelector('a').getAttribute('data-id'),
        name: card.querySelector('.cart__item-name').textContent,
        price: card.querySelector('.cart__item-price').textContent.replace('$', ''),
        quantity: 1,
        img: card.querySelector('.cart__item-img').src
    }

    const exists = cart_items.some(item => item.id === infoProduct.id);
    if (exists) {
        const items = cart_items.map(item => {
            if (item.id === infoProduct.id) {
                item.quantity++;
                return item;
            }
            return item;
        });
        cart_items = [...items];    
    } else {
        cart_items = [...cart_items, infoProduct];
    }

    printCart();
}