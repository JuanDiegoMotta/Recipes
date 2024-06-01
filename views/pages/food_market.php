<main class="container2">
    <div class="food-market__header flex justify-between">
        <div class="header__nav flex">
            <p class="nav-item active" id="prepared-meals">Prepared Meals</p>
            <p class="nav-item" id="ingredients">Ingredients</p>
        </div>

        <div>
            <div class="relative">
                <svg class="cursor-pointer filters_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                    <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/>
                </svg>

                <ul class="none filters">
                 <li class="relative">
                    <svg class="filters__search-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    <input type="search" name="search_food" id="search_food" placeholder="Search for a food">
                 </li>
                 <li>
                    <p class="bold mt-20">
                        Price
                    </p>
                    <div class="flex gap-20">
                        <div class="flex flex-col flex-1">
                            <label for="min_price">Min</label>
                            <select name="min_price" id="min_price">
                                <!-- Pintar el rango de precios con JS -->
                            </select>
                        </div>

                        <div class="flex flex-col flex-1">
                            <label for="max_price">Max</label>
                            <select name="max_price" id="max_price">
                                <!-- Pintar el rango de precios con JS -->
                            </select>
                        </div>
                    </div>
                 </li>
            </ul>
            </div>
            
        </div>
        

    </div>


    <section class="market">
        
    </section> <!-- .market -->
</main>