<div class="wrapper_template">
    <!-- MENU -->
    <ul class="wrapper_menu">
        <li class="menu_option current_option" id="profile">
            <span class="material-symbols-outlined menu_icon current_icon">person</span>
            <span class="menu_text current_text">Profile</span>

        </li>
        <li class="menu_option" id="myRecipes">
            <span class="material-symbols-outlined menu_icon">restaurant</span>
            <span class="menu_text">My Kitchen</span>
        </li>
        <li class="menu_option" id="foodPantry">
            <span class="material-symbols-outlined menu_icon">kitchen</span>
            <span class="menu_text">Food Pantry</span>

        </li>
        <li class="menu_option" id="settings">
            <span class="material-symbols-outlined menu_icon">settings</span>
            <span class="menu_text">Settings</span>

        </li>
        <li class="menu_option" id="logOut">
            <span class="material-symbols-outlined menu_icon logout_icon">logout</span>
            <span class="menu_text logout_text">Log out</span>

        </li>
    </ul>
    <span class="material-symbols-outlined menu-toggle-button" id="showMenuButton">chevron_right</span>
    <!-- CONTENT -->
    <div class="wrapper_content">
        <div class="wrapper_section_bar">
            <div class="wrapper_titles">
                <span class="title current_title">Title</span>
                <span class="title">Title</span>
                <span class="title">Title</span>
            </div>
            <div class="line">
                <div class="green_line"></div>
            </div>
        </div>
        <div class="content">
            <form action="" class="form_myprofile">
                <div class="myprofile_section1">
                    <div class="profile_photo">
                        <img src="/build/img/profile/profile_photo_placeholder.png" alt="">
                    </div>
                    <div class="email_pwd_wrapper">
                        <div class="input_block">
                            <label for="email">Email</label>
                            <input class="input_text" type="text" name="email" id="email">
                        </div>
                        <div class="input_block">
                            <label for="password">Password</label>
                            <input class="input_text" type="password" name="password" id="password">
                        </div>
                    </div>
                </div>
                <div class="line"></div>
                <div class="myprofile_section2">
                    <div class="section2_part1">
                        <div class="input_block">
                            <label for="name">Name</label>
                            <input class="input_text" type="text" name="name" id="name">
                        </div>
                        <div class="input_block">
                            <label for="surname">Surname</label>
                            <input class="input_text" type="text" name="surname" id="surname">
                        </div>
                    </div>
                    <div class="section2_part2">
                        <div class="input_block">
                            <label for="birthdate">Birth Date</label>
                            <input class="input_text" type="date" name="birthdate" id="birthdate">
                        </div>
                        <div class="input_block radio">
                            <p>Gender</p>
                            <input type="radio" name="gender" value="M" id="male" />
                            <label for="male">Male</label>
                            <input type="radio" name="gender" value="F" id="female" />
                            <label for="female">Female</label>
                        </div>
                    </div>
                    <div class="update_button">
                        <p>Update</p>
                        <div class="material-symbols-outlined">published_with_changes</div>
                    </div>
                </div>
            </form>
            <form action="" class="form_mygoals visible">
                <div class="mygoals_section1">
                    <div class="goal_text">What is you main goal?</div>
                    <div class="wrapper_goals"></div>
                </div>
                <div class="line"></div>
                <div class="mygoals_section2">

                </div>
            </form>
        </div>
    </div>
</div>