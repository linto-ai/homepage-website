function renderPlainTextTemplate(payload) {
  const plainTextTemplate = `
==================

Contact depuis linto.ai

==================

Nom/Prénom: ${payload.userName}
Société: ${payload.society}
Email: ${payload.email}
Objet: ${payload.subject}

==================

Message :
${payload.message}

==================

COPYRIGHT LINAGORA 2019
Siège social: LINAGORA SAS, Tour Franklin, 100 Terrasse Boieldieu, 92800 Puteaux, France
Téléphone: +33 810 251 251`

  return plainTextTemplate
}

module.exports = {
  renderPlainTextTemplate
}