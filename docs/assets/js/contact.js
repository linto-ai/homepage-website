$(document).ready(function(){
  // Submit contact form
  $('#contact-form-send').on('click', function () {
    handleForm()
  })

  function testName () {
    const regex = /^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\s\-\'\.]+$/
    const nameField = $('#contact-name')
    const nameError = $('#contact-name-error')
    const name = nameField.val()
    // clear errors
    nameField.removeClass('error')
    nameError.html('')
    if (name.length === 0) {
      nameError.html('Champs requis')
      nameField.addClass('error')
      return false
    } else if (!regex.test(name)) {
      nameError.html('Veuillez saisir un nom valide')
      nameField.addClass('error')
      return false
    } else {
      return true
    }
  }

  function testEmail () {
    const regex = /^[a-z]{1}[a-z0-9\-\.\_]*[a-z0-9]+[\@]+[a-z]{1}[a-z0-9\-\.]*[a-z0-9]+[\.]+[a-z]{2,5}$/
    const emailField = $('#contact-email')
    const emailError = $('#contact-email-error')
    const email = emailField.val()
    // clear errors
    emailField.removeClass('error')
    emailError.html('')
    if (email.length === 0) {
      emailError.html('Champs requis')
      emailField.addClass('error')
      return false
    } else if (!regex.test(email)) {
      emailError.html('Veuillez saisir une adresse email valide')
      emailField.addClass('error')
      return false
    } else {
      return true
    }
  }

  function testPhone () {
    const regex = /^\d{8,20}$/
    const phoneField = $('#contact-phone')
    const phoneError = $('#contact-phone-error')
    const phone = phoneField.val()
    // clear errors
    phoneField.removeClass('error')
    phoneError.html('')

    if (phone.length === 0) {
      return true
    } else {
      if (!regex.test(phone)) {
        phoneError.html('Veuillez saisir un numéro de téléphone valide')
        phoneField.addClass('error')
        return false
      } else {
        return true
      }
    }
  }



  function testMessage () {
    const msgField = $('#contact-msg')
    const msgError = $('#contact-msg-error')
    const msg = msgField.val()
    // clear errors
    msgField.removeClass('error')
    msgError.html('')

    if (msg.length === 0) {
      msgError.html('Champs requis')
      msgField.addClass('error')
      return false
    } else if (msg.includes('<') || msg.includes('>') || msg.includes('script') ||  msg.includes('|')) {
      msgError.html('Le message contient des caractères non autorisés')
      msgField.addClass('error')
      return false
    } else {
      return true
    }
  }

  function handleForm () {
    let isValid = true

    // Test User Name
    let nameValid = testName()
    let emailValid = testEmail()
    let phoneValid = testPhone()
    let msgValid = testMessage()

    if(!nameValid || !emailValid || !phoneValid || !msgValid ) {
      isValid = false
      return false
    }
    if (isValid){
      sendForm()
    }
  }

  function sendForm () {
    $('#contact-form-send').innerHTML = 'Envoi en cours...'
    const payload = {
      subject: 'Contact depuis linto.ai',
      username: $('#contact-name').val(),
      email: $('#contact-email').val(),
      phone: $('#contact-phone').val(),
      society: $('#contact-society').val(),
      message: $('#contact-msg').val()
    }
    
    // Request
    axios.post('https://dl.linto.ai/mail/send', {
      method: 'post',
      data: payload
    })
    .then(function (response) {
      $('.submit-btn').innerHTML = 'Envoyer'
      if(response.data.status === 'success') {
        // Success
        $('#contact-success').removeClass('hidden')
        setTimeout(function () {
          $('#contact-success').addClass('hidden')
        }, 5000)
        $('#contact-msg').val('')
      } else {
        throw response.data
      }
    })
    .catch(function (error) {
      // Error
      console.error(error)
      $('#contact-error').removeClass('hidden')
    });
  }

  $('#contact-name').on('blur', function () {
    testName()
  })
  $('#contact-email').on('blur',function () {
    testEmail()
  })
  $('#contact-phone').on('blur', function () {
    testPhone()
  })
  $('#contact-subject').on('blur',function () {
    testSubject()
  })
  $('#contact-msg').on('blur',function () {
    testMessage()
  })
})