document.addEventListener('DOMContentLoaded', function () {
  initializeMenu();
  fetchProfileData()
  allergyCardListeners();
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
