function renderHtmlTemplate(payload) {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Password Reset</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body{
        background-color: #f2f2f2;
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
      }
      #mail-wrapper{
        width: 100%;
        background-color: #f2f2f2;
        text-align:center;
      }
      table{
        width: 100%;
        max-width: 960px;
        min-width: 320px;
        border: none;
        border-collapse: collapse !important;
        margin: 0 auto;
      }

      #mail-header{
        background-color: #f2f2f2;
      }
      .logo{
        display: inline-block;
        max-height: 100px;
        width: auto;
        margin: 0 10px;
      }

      #mail-body {
        padding: 20px;
        background-color: #ffffff;
      }
      #mail-body tbody tr{
        border-bottom: 1px solid #eeeeee;
      }
      #mail-body tbody tr td{
        padding: 10px;
        vertical-align: top;
      }
      .mail-title{
        font-size: 22px;
        font-weight: 600;
        color: #45baeb;
        text-align: center;
        padding: 40px 0 20px 0;
      }
      td.mail-contact-label {
        font-size: 14px;
        width: 25%;
        text-align: right;
        vertical-align: top;
      }
      td.mail-content{
        font-size: 14px;
        line-height: 22px;
        text-align: left;
        vertical-align: top;
      }
      td.mail-link{
        text-align: center;
        padding: 20px 0;
      }
      a#reset-link {
        display: inline-block;
        padding: 20px 10px;
        background-color: #2da800;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        text-transform: uppercase;
        color: #fff;
        text-decoration: none;
        -moz-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
        -webkit-box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
        box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.2);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
      a.link{
        color: #007bff;
        text-decoration: underline;
      }
      strong {
        font-weight: 700;
        color: #364954;
      }

      #mail-footer{
        background-color: #ffffff;
        border-top: 1px solid #ccc;

      }
      .logo-footer{
        display: inline-block;
        height: 60px;
        width: auto;
        padding: 20px 0;
      }
      .copyright{
        padding: 30px 0;
        background-color: #45baeb;
        text-align: center;
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div id="mail-wrapper">
      <!-- Header -->
      <table id="mail-header" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td colspan="2" class="mail-title">Contact depuis linto.ai</td>
          </tr>
        </tbody>
      </table>
      <!-- END Header -->

      <!-- Body -->
      <table id="mail-body" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td class="mail-contact-label">
              Nom / prénom :
            </td>
            <td class="mail-content">
              ${payload.username}
            </td>
          </tr>
          <tr>
            <td class="mail-contact-label">
              Email :
            </td>
            <td class="mail-content">
              <a href="mailto:${payload.email}">${payload.email}</a>
            </td>
          </tr>
          <tr>
            <td class="mail-contact-label">
              Société :
            </td>
            <td class="mail-content">
              ${payload.society.length > 0 ? payload.society : 'Non renseigné'}
            </td>
          </tr>

          <tr>
            <td class="mail-contact-label">
              Phone :
            </td>
            <td class="mail-content">
              ${payload.phone.length > 0 ? payload.phone : 'Non renseigné'}
            </td>
          </tr>
          <tr>
            <td class="mail-contact-label">
              Message :
            </td>
            <td class="mail-content">
              ${payload.message}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- END Body -->
      <table id="mail-footer" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td align="center" class="copyright">
              © COPYRIGHT LINAGORA 2019
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
  </html>`
  return htmlTemplate
}

module.exports = {
  renderHtmlTemplate
}