function renderPlainTextTemplate(payload) {
  const plainTextTemplate = `
==================

Contact depuis linto.ai

==================

Nom/Prénom: ${payload.username}
Email: ${payload.email}
Téléphone: ${payload.phone.length > 0 ? payload.phone : 'non renseigné'}
Société: ${payload.society.length > 0 ? payload.society : 'non renseigné'}

==================

Message :
${payload.message}

==================

COPYRIGHT LINAGORA 2019
`

  return plainTextTemplate
}

module.exports = {
  renderPlainTextTemplate
}