document.addEventListener('DOMContentLoaded', function () {
  initializeMenu();
  fetchProfileData()
  allergyCardListeners();
  initializeSectionBar();
  profilePhotoListener();
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
    document.querySelector('.profile_photo img').src = profileData.photo;
  }

  // Email
  document.getElementById('email').value = profileData.email || '';

  // Información personal
  document.getElementById('name').value = profileData.name || '';
  document.getElementById('surname').value = profileData.surname || '';
  document.getElementById('birthdate').value = profileData.birth_date || '';

  // Género
  if (profileData.gender) {
    document.querySelector(`input[name="gender"][value="${profileData.gender}"]`).checked = true;
  }

  // Objetivo
  if (profileData.goal !== null && profileData.goal !== undefined) {
    document.querySelector(`input[name="goal"][value="${profileData.goal}"]`).checked = true;
  }

  // Información de salud
  document.getElementById('height').value = profileData.height || '';
  document.getElementById('weight').value = profileData.weight || '';
  document.getElementById('activity').value = profileData.activity || '';

  // Calorías estimadas
  document.getElementById('calories').value = profileData.calories || '';

  // Dieta
  document.getElementById('diet_select').value = profileData.diet || '';

  // Alergias
  if (profileData.allergies) {
    profileData.allergies.split(',').forEach(allergy => {
      const checkbox = document.querySelector(`input[name="allergies"][value="${allergy}"]`);
      if (checkbox) {
        checkbox.checked = true;
        // Añadir la clase "selected" al elemento label que contiene este checkbox
        checkbox.closest('label').classList.add('selected');
      }
    });
  }

  // Otras alergias
  document.getElementById('other').value = profileData.other || '';
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

  profilePhotoInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
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
