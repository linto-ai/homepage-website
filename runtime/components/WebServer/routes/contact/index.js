const debug = require('debug')('routes:contact')
const mailer = require(`${process.cwd()}/components/WebServer/sendMail`)

module.exports = (webServer) => {
  return [{
    path: '/send',
    method: 'post',
    controller: async (req, res, next) => {
      try {
        let payload = req.body.payload
        console.log('body :', req.body)
        /*const sendMail = await mailer.sendContactMail(payload)
        if (sendMail === 'mailSend') {
          res.json({
            status: 'success'
          })
        } else {
          throw `Error on sending email (${sendMail}).`
        }*/
        res.json({test:'test'})
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