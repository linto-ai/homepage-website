function initializeContactForm() {
  const contactModal = document.getElementById('contact-modal');
  const contactButtonMain = document.getElementById('contact-button-main');
  const contactButtonFooter = document.getElementById('contact-button-footer');
  const closeButton = document.querySelector('.close-button');
  const contactForm = document.getElementById('contact-form');
  const sendButton = document.getElementById('contact-form-send');

  function openModal(e) {
    e.preventDefault();
    if (contactModal) {
      contactModal.style.display = 'block';
    }
  }

  // --- Modal Handling ---
  if (contactButtonMain) {
    contactButtonMain.addEventListener('click', openModal);
  }
  if (contactButtonFooter) {
    contactButtonFooter.addEventListener('click', openModal);
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target === contactModal) {
      if (contactModal) {
        contactModal.style.display = 'none';
      }
    }
  });

  // --- Form Validation ---
  const nameField = document.getElementById('contact-name');
  const emailField = document.getElementById('contact-email');
  const phoneField = document.getElementById('contact-phone');
  const msgField = document.getElementById('contact-msg');

  const nameError = document.getElementById('contact-name-error');
  const emailError = document.getElementById('contact-email-error');
  const phoneError = document.getElementById('contact-phone-error');
  const msgError = document.getElementById('contact-msg-error');

  function validateName() {
    const regex = /^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\s\-\'\.]+$/;
    const value = nameField.value;
    nameField.classList.remove('error');
    nameError.textContent = '';
    if (value.length === 0) {
      nameError.textContent = 'Champs requis';
      nameField.classList.add('error');
      return false;
    } else if (!regex.test(value)) {
      nameError.textContent = 'Veuillez saisir un nom valide';
      nameField.classList.add('error');
      return false;
    }
    return true;
  }

  function validateEmail() {
    const regex = /^[a-z]{1}[a-z0-9\-\.\_]*[a-z0-9]+[\@]+[a-z]{1}[a-z0-9\-\.]*[a-z0-9]+[\.]+[a-z]{2,5}$/;
    const value = emailField.value;
    emailField.classList.remove('error');
    emailError.textContent = '';
    if (value.length === 0) {
      emailError.textContent = 'Champs requis';
      emailField.classList.add('error');
      return false;
    } else if (!regex.test(value)) {
      emailError.textContent = 'Veuillez saisir une adresse email valide';
      emailField.classList.add('error');
      return false;
    }
    return true;
  }

  function validatePhone() {
    const regex = /^\d{8,20}$/;
    const value = phoneField.value;
    phoneField.classList.remove('error');
    phoneError.textContent = '';
    if (value.length > 0 && !regex.test(value)) {
      phoneError.textContent = 'Veuillez saisir un numéro de téléphone valide';
      phoneField.classList.add('error');
      return false;
    }
    return true;
  }

  function validateMessage() {
    const value = msgField.value;
    msgField.classList.remove('error');
    msgError.textContent = '';
    if (value.length === 0) {
      msgError.textContent = 'Champs requis';
      msgField.classList.add('error');
      return false;
    } else if (/[<>()|]/.test(value) || value.toLowerCase().includes('script')) {
      msgError.textContent = 'Le message contient des caractères non autorisés';
      msgField.classList.add('error');
      return false;
    }
    return true;
  }

  // --- Form Submission ---
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isMsgValid = validateMessage();

      if (isNameValid && isEmailValid && isPhoneValid && isMsgValid) {
        sendForm();
      }
    });
  }

  function sendForm() {
    sendButton.textContent = 'Envoi en cours...';
    const payload = {
      subject: 'Contact depuis linto.ai',
      username: nameField.value,
      email: emailField.value,
      phone: phoneField.value,
      society: document.getElementById('contact-society').value,
      message: msgField.value
    };

    axios.post('https://dl.linto.ai/mail/send', {
      method: 'post',
      data: payload
    })
    .then(function (response) {
      sendButton.textContent = 'Envoyer';
      if (response.data.status === 'success') {
        document.getElementById('contact-success').classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('contact-success').classList.add('hidden');
        }, 5000);
        msgField.value = '';
      } else {
        throw response.data;
      }
    })
    .catch(function (error) {
      console.error(error);
      sendButton.textContent = 'Envoyer';
      document.getElementById('contact-error').classList.remove('hidden');
    });
  }

  // --- Real-time Validation ---
  if (nameField) nameField.addEventListener('blur', validateName);
  if (emailField) emailField.addEventListener('blur', validateEmail);
  if (phoneField) phoneField.addEventListener('blur', validatePhone);
  if (msgField) msgField.addEventListener('blur', validateMessage);
}
