const debug = require('debug')('routes:contact')
const mailer = require(`${process.cwd()}/components/WebServer/sendMail`)
function formatMessage(msg) {
  return msg.replace(/\n/g, "<br />")
}

module.exports = (webServer) => {
  return [{
    path: '/send',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        let payload = req.body.payload
        payload.message = formatMessage(payload.message)
        const sendMail = await mailer.sendContactMail(payload)
        if (sendMail === 'mailSend') {
          res.json({
            status: 'success'
          })
        } else {
          throw `Error on sending email (${sendMail}).`
        }
      } catch (err) {
        console.error(err)
        res.json({
          status: 'error',
          msg: err
        })
      }
    }
  }]
}