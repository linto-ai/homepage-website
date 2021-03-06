const debug = require('debug')('routes:contact')
const mailer = require(`${process.cwd()}/components/WebServer/sendMail`)

module.exports = (webServer) => {
  return [{
    path: '/send',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        let payload = req.body.data
        const sendMail = await mailer.sendContactMail(payload)
        if (sendMail === 'mailSend') {
          res.json({
            status: 'success',
            msg: 'Votre message à bien été envoyé. Il sera traité dans les plus brefs délais.'
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