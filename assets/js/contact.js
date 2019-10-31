$(document).ready(function(){

  $('.submit-btn').on('click', function () {
    handleForm()
  })


  function testName () {
    const regex = /^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\s\-\']+$/
    const nameField = $('#contact-name')
    const nameError = $('.error-field.username')
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
    const regex = /^[a-z]{1}[a-z0-9\-\.\_]*[a-z0-9]+[\@]+[a-z]{1}[a-z0-9\-\.]*[a-z0-9]+[\.]+[a-z]{2,4}$/
    const emailField = $('#contact-email')
    const emailError = $('.error-field.email')
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
    const phoneError = $('.error-field.phone')
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

  function testSociety () {
    regex = /^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\s\-\']+$/

    const societyField = $('#contact-society')
    const societyError = $('.error-field.society')
    const society = societyField.val()
    // clear errors
    societyField.removeClass('error')
    societyError.html('')

    if (society.length === 0) {
      return true
    } else {
      if (!regex.test(society)) {
        societyError.html('Veuillez saisir un nom de société valide')
        societyField.addClass('error')
        return false
      } else {
        return true
      }
    }
  }

  function testMessage () {
    const msgField = $('#contact-msg')
    const msgError = $('.error-field.msg')
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
    let societyValid = testSociety()
    let msgValid = testMessage()

    if(!nameValid || !emailValid || !phoneValid || !societyValid || !msgValid) {
      isValid = false
      return false
    }
    if (isValid){
      sendForm()
    }
  }

  function sendForm () {
    const payload = {
      subject: 'Contact depuis linto.ai',
      username: $('#contact-name').val(),
      email: $('#contact-email').val(),
      phone: $('#contact-phone').val(),
      society: $('#contact-society').val(),
      message: $('#contact-msg').val()
    }
    console.log(payload, typeof(payload))
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch('https://gamma.linto.ai/mail/send', {
        method: 'post',
        headers: myHeaders,
        mode: 'no-cors',
        body: JSON.stringify(payload)
    })
    .then((res) => res.json())
    .then(function (data) {
      console.log('response: ', data)
      if (data === 'mailSend') {
        $('#contact-msg').innerHTML = ''
      } else {
        throw 'Une erreur est survenue.'
      }
    })
    .catch(function (err) {
      console.log(err)
    })
  }

  document.getElementById('contact-name').onblur = function () {
    testName()
  }
  document.getElementById('contact-email').onblur = function () {
    testEmail()
  }
  document.getElementById('contact-phone').onblur = function () {
    testPhone()
  }
  document.getElementById('contact-society').onblur = function () {
    testSociety()
  }
  document.getElementById('contact-msg').onblur = function () {
    testMessage()
  }
})
