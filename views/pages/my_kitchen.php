<div class="wrapper_template">
    <!-- MENU -->
    <ul class="wrapper_menu">
        <a href="/profile" class="menu_option " id="profile">
            <span class="material-symbols-outlined menu_icon ">person</span>
            <span class="menu_text ">Profile</span>

        </a>
        <a href="/mykitchen" class="menu_option current_option" id="myRecipes">
            <span class="material-symbols-outlined menu_icon current_icon">restaurant</span>
            <span class="menu_text current_text">My Kitchen</span>
        </a>
        <a href="" class="menu_option" id="foodPantry">
            <span class="material-symbols-outlined menu_icon">kitchen</span>
            <span class="menu_text">Food Pantry</span>

        </a>
        <a href="" class="menu_option" id="settings">
            <span class="material-symbols-outlined menu_icon">settings</span>
            <span class="menu_text">Settings</span>

        </a>
        <a href="" class="menu_option" id="logOut">
            <span class="material-symbols-outlined menu_icon logout_icon">logout</span>
            <span class="menu_text logout_text">Log out</span>
        </a>
    </ul>
    <span class="material-symbols-outlined menu-toggle-button" id="showMenuButton">chevron_right</span>
    <!-- CONTENT -->
    <div class="wrapper_content">
        <div class="wrapper_section_bar">
            <div class="wrapper_titles">
                <span class="title current_title" id="favorites">Favorites</span>
                <span class="title" id="myRecipes">My Recipes</span>
                <span class="title" id="addRecipe">Add Recipe</span>
            </div>
            <div class="line">
                <div class="green_line"></div>
            </div>
        </div>
        <div class="content favorites ">

        </div>
        <div class="content myRecipes">
            <section class="myRecipes_grid">

            </section>
        </div>
        <div class="content addRecipe visible">
            <form id="addRecipeForm" enctype="multipart/form-data">

                <div class="addRecipeSection1">
                    <div class="input_block">
                        <div class="input_header">
                            <label for="recipeName">Recipe Name</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="recipeName">arrow_drop_down</span>
                        </div>
                        <input type="text" id="recipeName" name="recipeName" class="toggle-input" required>
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="description">Description</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="description">arrow_drop_down</span>
                        </div>
                        <textarea id="description" name="description" class="toggle-input"></textarea>
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="instructions">Instructions (separated by #)</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="instructions">arrow_drop_down</span>
                        </div>
                        <textarea id="instructions" name="instructions" class="toggle-input" required></textarea>
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="ingredients">Ingredients (separated by commas)</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="ingredients">arrow_drop_down</span>
                        </div>
                        <textarea id="ingredients" name="ingredients" class="toggle-input" required></textarea>
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="allergens">Allergens (separated by commas)</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="allergens">arrow_drop_down</span>
                        </div>
                        <textarea id="allergens" name="allergens" class="toggle-input"></textarea>
                    </div>
                </div>

                <div class="addRecipeSection2">
                    <div class="input_block">
                        <div class="input_header">
                            <label for="photo">Photo</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="photo">arrow_drop_down</span>
                        </div>
                        <input type="file" id="photo" name="photo" class="toggle-input" accept="image/*">
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="prepTime">Preparation Time (minutes)</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="prepTime">arrow_drop_down</span>
                        </div>
                        <input type="number" id="prepTime" name="prepTime" class="toggle-input" min="0" required>
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="calories">Calories</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="calories1">arrow_drop_down</span>
                        </div>
                        <input type="number" id="calories1" name="calories" class="toggle-input" min="0">
                    </div>
                    <div class="input_block">
                        <div class="input_header">
                            <label for="serves">Serves</label>
                            <span class="material-symbols-outlined toggle-icon" data-target="serves">arrow_drop_down</span>
                        </div>
                        <input type="number" id="serves" name="serves" class="toggle-input" min="1" required>
                    </div>
                    <div class="update_button" id="submitRecipeButton">
                        <p>Add Recipe</p>
                        <span class="material-symbols-outlined">published_with_changes</span>
                    </div>
                    <div class="error_message" id="errorMessage"></div>
                </div>
            </form>
        </div>
    </div>
</div>