document.addEventListener('DOMContentLoaded', function () {
  initializeMenu();
  fetchProfileData()
  allergyCardListeners();
  initializeSectionBar();
  profilePhotoListener();
  addUpdateListeners();
  setupCalorieCalculation();
  setupPasswordModal();
  setupLogout();
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

function fetchProfileData() {
  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'get_profile_data' })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log(data);
        fillProfileForm(data.data);
      } else {
        console.error('Error fetching profile data:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function fillProfileForm(profileData) {
  // Foto de perfil
  if (profileData.photo != '' && profileData.photo != null) {
    const photoElement = document.querySelector('.profile_photo img');
    photoElement.src = profileData.photo;
  }

  // Email
  const emailField = document.getElementById('email');
  emailField.value = profileData.email;
  emailField.dataset.originalValue = profileData.email;

  // Información personal
  const nameField = document.getElementById('name');
  nameField.value = profileData.name || '';
  nameField.dataset.originalValue = profileData.name || '';

  const surnameField = document.getElementById('surname');
  surnameField.value = profileData.surname || '';
  surnameField.dataset.originalValue = profileData.surname || '';

  const birthdateField = document.getElementById('birthdate');
  birthdateField.value = profileData.birth_date || '';
  birthdateField.dataset.originalValue = profileData.birth_date || '';

  // Género
  if (profileData.gender) {
    const genderField = document.querySelector(`input[name="gender"][value="${profileData.gender}"]`);
    const genderWrapper = document.querySelector('.input_block.radio');
    genderField.checked = true;
    genderWrapper.dataset.originalValue = profileData.gender;
  } else {
    const genderWrapper = document.querySelector('.input_block.radio');
    genderWrapper.dataset.originalValue = '';
  }

  // Objetivo
  if (profileData.goal !== null && profileData.goal !== undefined) {
    const goalWrapper = document.querySelector('.wrapper_goals');
    const goalField = document.querySelector(`input[name="goal"][value="${profileData.goal}"]`);
    goalField.checked = true;
    goalWrapper.dataset.originalValue = profileData.goal;
  } else {
    const goalWrapper = document.querySelector('.wrapper_goals');
    goalWrapper.dataset.originalValue = '';
  }

  // Información de salud
  const heightField = document.getElementById('height');
  heightField.value = profileData.height || '';
  heightField.dataset.originalValue = profileData.height || '';

  const weightField = document.getElementById('weight');
  weightField.value = profileData.weight || '';
  weightField.dataset.originalValue = profileData.weight || '';

  if (profileData.activity !== null && profileData.activity !== undefined) {
    const activityField = document.getElementById('activity');
    activityField.value = profileData.activity;
    activityField.dataset.originalValue = profileData.activity;
  } else {
    const activityField = document.getElementById('activity');
    activityField.dataset.originalValue = '';
  }

  // Calorías estimadas
  const caloriesField = document.getElementById('calories');
  caloriesField.value = profileData.calories || '';
  caloriesField.dataset.originalValue = profileData.calories || '';

  // Dieta
  const dietField = document.getElementById('diet_select');
  dietField.value = profileData.diet || '';
  dietField.dataset.originalValue = profileData.diet || '';

  // Alergias
  if (profileData.allergies) {
    const allergiesWrapper = document.querySelector('.allergies');
    allergiesWrapper.dataset.originalValue = profileData.allergies;
    profileData.allergies.split(',').forEach(allergy => {
      const checkbox = document.querySelector(`input[name="allergies"][value="${allergy}"]`);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.closest('label').classList.add('selected');
      }
    });
  } else {
    const allergiesWrapper = document.querySelector('.allergies');
    allergiesWrapper.dataset.originalValue = '';
  }

  // Otras alergias
  const otherField = document.getElementById('other');
  otherField.value = profileData.other || '';
  otherField.dataset.originalValue = profileData.other || '';
}

function allergyCardListeners() {
  const checkboxes = document.querySelectorAll(".allergy_checkbox");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const card = this.closest('.allergy_card');
      console.log(this.checked);
      card.classList.toggle('selected');
    });
  });
}

function initializeSectionBar() {
  const titles = document.querySelectorAll('.wrapper_titles .title');
  const forms = document.querySelectorAll('.content form');
  const greenLine = document.querySelector('.green_line');

  titles.forEach((title, index) => {
    title.addEventListener('click', function () {
      // Cambiar formulario visible
      forms.forEach(form => form.classList.remove('visible'));
      forms[index].classList.add('visible');

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
  const positions = ['0%', '36%', '70%']; // Ajusta estas posiciones según sea necesario
  greenLine.style.left = positions[index];
}

function profilePhotoListener() {
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  console.log('proflePhotoInput:', profilePhotoInput);

  profilePhotoInput.addEventListener('change', function (event) {
    console.log('change event');
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector('.profile_photo img').src = e.target.result;
      }
      reader.readAsDataURL(file);

      // Llamar a la función para subir la foto al servidor
      uploadProfilePhoto(file);
    }
  });
}
function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('action', 'upload_profile_picture');

  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Actualiza la imagen de perfil en la interfaz con la nueva URL
        document.querySelector('.profile_photo img').src = data.photoUrl;
      } else {
        console.error('Error uploading photo:', data.message);
        // Aquí puedes agregar un mensaje de error visible para el usuario
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function addUpdateListeners() {
  document.getElementById('updateProfileButton').addEventListener('click', function (event) {
    console.log('profile update button clicked');
    event.preventDefault();
    handleProfileUpdate();
  });

  document.getElementById('updateGoalsButton').addEventListener('click', function (event) {
    console.log('goals update button clicked');
    event.preventDefault();
    handleGoalsUpdate();
  });

  document.getElementById('updateDietButton').addEventListener('click', function (event) {
    console.log('profile update button clicked');
    event.preventDefault();
    handleDietUpdate();
  });
}

function handleProfileUpdate() {
  const formId = 'form_myprofile';
  const currentValues = getCurrentValues(formId);
  const originalValues = getOriginalValues(formId);

  const changedFields = compareValues(currentValues, originalValues);
  console.log('current: ', currentValues);
  console.log('original: ', originalValues);

  if (Object.keys(changedFields).length > 0) {
    console.log('changed: ', changedFields);
    console.log('enteringvalidate');
    validateAndUpdateProfile(changedFields);
  }
}

function handleGoalsUpdate() {
  const formId = 'form_mygoals';
  const currentValues = getCurrentValues(formId);
  const originalValues = getOriginalValues(formId);
  console.log('current: ', currentValues);
  console.log('original: ', originalValues);
  const changedFields = compareValues(currentValues, originalValues);

  if (Object.keys(changedFields).length > 0) {
    console.log('changed: ', changedFields);
    console.log('enteringvalidate');
    validateAndUpdateGoals(changedFields);
  }
}

function handleDietUpdate() {
  const formId = 'form_mydiet';
  const currentValues = getCurrentValues(formId);
  const originalValues = getOriginalValues(formId);

  const changedFields = compareValues(currentValues, originalValues);
  console.log('current: ', currentValues);
  console.log('original: ', originalValues);

  if (Object.keys(changedFields).length > 0) {
    console.log('changed: ', changedFields);
    console.log('enteringvalidate');
    validateAndUpdateDiet(changedFields);
  }
}

function getCurrentValues(formId) {
  const currentValues = {};

  switch (formId) {
    case 'form_myprofile':
      currentValues['email'] = document.getElementById('email').value || '';
      currentValues['name'] = document.getElementById('name').value || '';
      currentValues['surname'] = document.getElementById('surname').value || '';
      currentValues['birthdate'] = document.getElementById('birthdate').value || '';
      currentValues['gender'] = document.querySelector('input[name="gender"]:checked')?.value || '';
      break;

    case 'form_mygoals':
      // Para 'goal' y 'activity', no usar || porque 0 es un valor válido.
      const goalField = document.querySelector('input[name="goal"]:checked');
      currentValues['goal'] = (goalField != null) ? goalField.value : '';

      const heightField = document.getElementById('height');
      currentValues['height'] = heightField.value || '';

      const weightField = document.getElementById('weight');
      currentValues['weight'] = weightField.value || '';

      const activityField = document.getElementById('activity');
      currentValues['activity'] = (activityField != null && activityField.value !== '') ? activityField.value : '';

      const caloriesField = document.getElementById('calories');
      currentValues['calories'] = caloriesField.value || '';
      break;

    case 'form_mydiet':
      const dietField = document.getElementById('diet_select');
      currentValues['diet'] = dietField.value || '';

      currentValues['allergies'] = Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(el => el.value).join(',');

      const otherField = document.getElementById('other');
      currentValues['other'] = otherField.value || '';
      break;

    default:
      console.error(`Unknown form ID: ${formId}`);
      break;
  }

  return currentValues;
}
function getOriginalValues(formId) {
  const originalValues = {};

  switch (formId) {
    case 'form_myprofile':
      originalValues['email'] = document.getElementById('email').dataset.originalValue || '';
      originalValues['name'] = document.getElementById('name').dataset.originalValue || '';
      originalValues['surname'] = document.getElementById('surname').dataset.originalValue || '';
      originalValues['birthdate'] = document.getElementById('birthdate').dataset.originalValue || '';
      originalValues['gender'] = document.querySelector('.input_block.radio').dataset.originalValue || '';
      break;

    case 'form_mygoals':
      const goalWrapper = document.querySelector('.wrapper_goals');
      originalValues['goal'] = goalWrapper.dataset.originalValue != null ? goalWrapper.dataset.originalValue : '';

      originalValues['height'] = document.getElementById('height').dataset.originalValue || '';
      originalValues['weight'] = document.getElementById('weight').dataset.originalValue || '';
      originalValues['activity'] = document.getElementById('activity').dataset.originalValue != null ? document.getElementById('activity').dataset.originalValue : '';
      originalValues['calories'] = document.getElementById('calories').dataset.originalValue || '';
      break;

    case 'form_mydiet':
      const dietField = document.getElementById('diet_select');
      originalValues['diet'] = dietField.dataset.originalValue || '';

      const allergiesWrapper = document.querySelector('.allergies');
      originalValues['allergies'] = allergiesWrapper.dataset.originalValue || '';

      originalValues['other'] = document.getElementById('other').dataset.originalValue || '';
      break;

    default:
      console.error(`Unknown form ID: ${formId}`);
      break;
  }

  return originalValues;
}

function compareValues(currentValues, originalValues) {
  const changedFields = {};

  for (let key in currentValues) {
    // Se comprueba si el valor actual es diferente del valor original
    if (currentValues[key] !== originalValues[key]) {
      changedFields[key] = currentValues[key];
    }
  }

  return changedFields;
}

function validateAndUpdateProfile(changedFields) {
  let isValid = true;
  clearErrors();

  // Validar el email
  if ('email' in changedFields) {
    if (!validateEmail(changedFields.email)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }
  }

  // Validar la fecha de nacimiento
  if ('birthdate' in changedFields) {
    if (changedFields.birthdate.trim() !== '' && !validateBirthdate(changedFields.birthdate)) {
      showError('birthdate', 'Please enter a valid birthdate.');
      isValid = false;
    }
  }

  // Convertir campos vacíos a null
  ['name', 'surname'].forEach(field => {
    if (field in changedFields && changedFields[field].trim() === '') {
      changedFields[field] = null;
    }
  });

  if (isValid) {
    updateProfileOnServer(changedFields);
  }
}




function validateAndUpdateGoals(changedFields) {
  let isValid = true;
  clearErrors();

  // Validar altura
  if ('height' in changedFields) {
    const height = parseFloat(changedFields.height);
    if (changedFields.height.trim() !== '' && (isNaN(height) || height < 100 || height > 300)) {
      showError('height', 'Height must be between 100cm and 300cm.');
      isValid = false;
    }
  }

  // Validar peso
  if ('weight' in changedFields) {
    const weight = parseFloat(changedFields.weight);
    if (changedFields.weight.trim() !== '' && (isNaN(weight) || weight < 20 || weight > 300)) {
      showError('weight', 'Weight must be between 20kg and 300kg.');
      isValid = false;
    }
  }

  // Convertir campos vacíos a null
  ['height', 'weight'].forEach(field => {
    if (field in changedFields && changedFields[field].trim() === '') {
      changedFields[field] = null;
    }
  });

  if (isValid) {
    updateGoalOnServer(changedFields);
  }
}

function validateAndUpdateDiet(changedFields) {
  let isValid = true;
  clearErrors();

  // Validar campo "other"
  if ('other' in changedFields) {
    if (changedFields.other.trim() !== '' && !validateOther(changedFields.other)) {
      showError('other', 'Please enter valid allergies separated by commas.');
      isValid = false;
    }
  }

  // Convertir campos vacíos a null
  ['allergies', 'other'].forEach(field => {
    if (field in changedFields && changedFields[field].trim() === '') {
      changedFields[field] = null;
    }
  });

  if (isValid) {
    updateDietOnServer(changedFields);
  }
}

function updateProfileOnServer(changedFields) {
  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updateProfile',
      data: changedFields
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessMessage('Profile updated successfully.');
        showNextForm('form_myprofile');

      } else {
        console.error('Error updating profile:', data.message);

        if (data.error === 'email') {
          // Show specific error for email
          showError('email', 'This email is already in use. Please use a different email.');
        } else {
          // Show general error for the profile
          showError('profile', data.message);
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




function updateGoalOnServer(changedFields) {
  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updateGoal',
      data: changedFields
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessMessage('Goals updated successfully.');
        showNextForm('form_mygoals');
      } else {
        console.error('Error updating goals:', data.message);
        showError('goal', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function updateDietOnServer(changedFields) {
  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updateDiet',
      data: changedFields
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessMessage('Diet updated successfully.');
        showNextForm('form_mydiet');
      } else {
        console.error('Error updating diet:', data.message);
        showError('diet', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validateOther(other) {
  // Asegurarse de que el campo "other" esté en formato de palabras separadas por comas
  const regex = /^(\w+\s?)(,\s*\w+\s?)*$/;
  return regex.test(other);
}

function validateBirthdate(birthdate) {
  const birthdateObj = new Date(birthdate);
  const currentDate = new Date();
  const minDate = new Date('1900-01-01');
  const age = currentDate.getFullYear() - birthdateObj.getFullYear();

  if (birthdateObj > currentDate || birthdateObj < minDate) {
    showError('birthdate', 'Please enter a valid birthdate.');
    return false;
  }

  if (age > 120 || age < 12) {
    showError('birthdate', 'Age must be between 12 and 120.');
    return false;
  }

  return true;
}
function showError(inputId, message) {
  let inputField;
  let errorMessage = document.createElement('div');
  errorMessage.className = 'error_message';
  errorMessage.innerText = message;
  console.log('Error in', inputId, 'message:', message);
  switch (inputId) {
    case 'email':
    case 'name':
    case 'surname':
    case 'birthdate':
    case 'height':
    case 'weight':
    case 'other':
      inputField = document.getElementById(inputId);
      if (inputField) {
        inputField.parentNode.appendChild(errorMessage);
      }
      break;

    case 'gender':
      inputField = document.querySelector('.input_block.radio');
      if (inputField) {
        inputField.appendChild(errorMessage);
      }
      break;

    case 'goal':
      inputField = document.querySelector('.wrapper_goals');
      if (inputField) {
        inputField.appendChild(errorMessage);
      }
      break;

    case 'diet_select':
      inputField = document.getElementById('diet_select').parentNode;
      if (inputField) {
        inputField.appendChild(errorMessage);
      }
      break;

    case 'allergies':
      inputField = document.querySelector('.allergies');
      if (inputField) {
        inputField.appendChild(errorMessage);
      }
      break;
    case 'confirmNewPassword':
      inputField = document.getElementById('confirmNewPassword');
      console.log(inputField);
      if (inputField) {
        inputField.parentNode.appendChild(errorMessage);
      }
      break;
    case 'currentPassword':
      inputField = document.getElementById('currentPassword');
      console.log(inputField);
      if (inputField) {
        inputField.parentNode.appendChild(errorMessage);
      }
      break
    case 'updatePassword':
      inputField = document.getElementById('confirmNewPassword');
      console.log(inputField);
      if (inputField) {
        inputField.parentNode.appendChild(errorMessage);
      }
      break;
    default:
      console.warn(`Unrecognized input ID: ${inputId}`);
      break;
  }
}

function clearErrors() {
  const errorMessages = document.querySelectorAll('.error_message');
  errorMessages.forEach(error => error.remove());
}

function showSuccessMessage(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.innerText = message;

  // Mostrar el mensaje con la transición
  successMessage.classList.add('show');

  // Ocultar el mensaje después de 2 segundos
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 1000); // Ajusta el tiempo según necesites
}


function showNextForm(currentFormId) {
  const formSequence = ['form_myprofile', 'form_mygoals', 'form_mydiet'];
  const currentIndex = formSequence.indexOf(currentFormId);

  if (currentIndex >= 0 && currentIndex < formSequence.length - 1) {
    const nextFormId = formSequence[currentIndex + 1];

    // Hide current form
    document.getElementById(currentFormId).classList.remove('visible');

    // Show next form
    document.getElementById(nextFormId).classList.add('visible');

    // Update section bar
    updateSectionBar(currentIndex + 1);
  }
}

function updateSectionBar(index) {
  const positions = ['0%', '36%', '70%']; // Adjust these positions as needed
  const greenLine = document.querySelector('.green_line');
  greenLine.style.left = positions[index];

  // Update title styles
  document.querySelector('.current_title').classList.remove('current_title');
  document.querySelectorAll('.wrapper_titles .title')[index].classList.add('current_title');
}

function setupPasswordModal() {
  console.log('entra asetuppwd');
  const editIcon = document.getElementById('edit_icon');
  const passwordModal = document.getElementById('passwordModal');
  const closeModal = document.getElementById('closeModal');
  const updatePasswordButton = document.getElementById('updatePasswordButton');

  // Mostrar la ventana modal
  editIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // Evitar que el evento de clic se propague y cierre la ventana modal
    passwordModal.classList.add('show');
  });

  // Cerrar la ventana modal
  closeModal.addEventListener('click', (event) => {
    event.stopPropagation(); // Evitar que el evento de clic se propague y cierre la ventana modal
    passwordModal.classList.remove('show');
    clearChangePassword();
    clearErrors();
  });

  // Cerrar la ventana modal al hacer clic fuera de ella
  window.addEventListener('click', (event) => {
    if (event.target === passwordModal) {
      passwordModal.classList.remove('show');
      clearChangePassword();
      clearErrors();
    }
  });

  // Manejar la actualización de la contraseña
  updatePasswordButton.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('Se clica botón update pwd');
    handlePasswordUpdate();
  });
}


// Función para manejar la actualización de la contraseña
function handlePasswordUpdate() {
  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();
  clearErrors();

  if (currentPassword == '' || currentPassword.length < 8) {
    showError('currentPassword', 'at least 8 characters');
    return;
  }
  if (newPassword !== confirmNewPassword) {
    showError('confirmNewPassword', 'Passwords do not match');
    return;
  }
  if (newPassword < 8) {
    showError('confirmNewPassword', 'at least 8 characters')
    return;
  }
  console.log(newPassword, currentPassword);
  // Realizar la solicitud para actualizar la contraseña en el servidor
  fetch('../../api/procesar_profile.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'updatePassword',
      currentPassword: currentPassword,
      newPassword: newPassword
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessMessage('Password updated successfully.');
        document.getElementById('passwordModal').classList.remove('show');
      } else {
        showError('updatePassword', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

  clearChangePassword()
}


function clearChangePassword() {
  // Obtener los campos de entrada
  const currentPasswordField = document.getElementById('currentPassword');
  const newPasswordField = document.getElementById('newPassword');
  const confirmNewPasswordField = document.getElementById('confirmNewPassword');

  // Restablecer los valores de los campos de entrada
  currentPasswordField.value = '';
  newPasswordField.value = '';
  confirmNewPasswordField.value = '';
}

function setupCalorieCalculation() {
  const showButton = document.getElementById('calculate_button');
  showButton.addEventListener('click', function (event) {
    event.preventDefault();
    calculateCalories();
  });
}

function calculateCalories() {
  const height = parseFloat(document.getElementById('height').value.trim());
  const weight = parseFloat(document.getElementById('weight').value.trim());
  const activity = document.getElementById('activity').value;
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  const birthDate = new Date(document.getElementById('birthdate').value);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  if (validateCalorieInputs(height, weight, activity, age, gender)) {
    let bmr;
    if (gender === 'M') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = getActivityMultiplier(activity);
    const estimatedCalories = bmr * activityMultiplier;

    document.getElementById('calories').value = Math.round(estimatedCalories);
  }
}

function validateCalorieInputs(height, weight, activity, age, gender) {
  clearErrors();

  let isValid = true;

  if (isNaN(height) || height <= 0) {
    showError('height', 'Please enter a valid height.');
    isValid = false;
  } else if (height < 100 || height > 300) {
    showError('height', 'Height must be between 100cm and 300cm.');
    isValid = false;
  }

  if (isNaN(weight) || weight <= 0) {
    showError('weight', 'Please enter a valid weight.');
    isValid = false;
  } else if (weight < 20 || weight > 300) {
    showError('weight', 'Weight must be between 20kg and 300kg.');
    isValid = false;
  }

  if (activity === '') {
    showError('activity', 'Please select an activity level.');
    isValid = false;
  }

  if (!gender) {
    showError('gender', 'Please select a gender.');
    isValid = false;
  }

  if (isNaN(age) || age < 12 || age > 120) {
    showError('birthdate', 'Please enter a valid birthdate.');
    isValid = false;
  }

  return isValid;
}

function getActivityMultiplier(activityLevel) {
  switch (activityLevel) {
    case '0':
      return 1.2; // Sedentary
    case '1':
      return 1.375; // Light activity
    case '2':
      return 1.55; // Moderate activity
    case '3':
      return 1.725; // High activity
    default:
      return 1.2; // Default to sedentary
  }
}

function setupLogout() {
  document.getElementById('logOut').addEventListener('click', function() {
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
}
