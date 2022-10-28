---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Contactez-nous
---
<script src="https://cdn.jsdelivr.net/npm/axios@1.1.3/dist/axios.min.js"></script>
<div id="body" class="flex col">
  <section>
    <div class="container">
      <h1 class="big-title centered green">Nous contacter</h1>
      <p class="thin text-centered">Appelez-nous ou écrivez-nous quelque soit votre sujet, nous vous répondrons le plus rapidement possible.<br/>
        Nous sommes joignable tous les jours ouvrés de 9h à 18h</p>
      <div class="flex row">
        <div class="flex col flex1 padding-20">
          <div class="form-field flex col">
            <span class="label">Prénom Nom <i>*</i></span>
            <input type="text" id="contact-name">
            <span class="error-field" id="contact-name-error"></span>
          </div>
          <div class="form-field flex col">
            <span class="label">Email <i>*</i></span>
            <input type="text" id="contact-email">
            <span class="error-field" id="contact-email-error"></span>
          </div>
          <div class="form-field flex col">
            <span class="label">Téléphone</span>
            <input type="text" id="contact-phone">
            <span class="error-field" id="contact-phone-error"></span>
          </div>
          <div class="form-field flex col">
            <span class="label">Société</span>
            <input type="text" id="contact-society">
            <span class="error-field" id="contact-society-error"></span>
          </div>
          <div class="form-field flex col">
            <span class="label">Message <i>*</i></span>
            <textarea id="contact-msg"></textarea>
            <span class="error-field" id="contact-msg-error"></span>
          </div>
          <div class="flex row form-field justify-center">
            <button class="btn-cta blue" id="contact-form-send">Envoyer</button>
          </div>
          <div class="contact-notif success hidden" id="contact-success">
            Votre message à bien été envoyé et sera traité dans les meilleurs délais.
          </div>  
          <div class="contact-notif error hidden" id="contact-error">
            Une erreur est survenue, veuillez rééssayer ultérieurement ou nous contacter directement sur <a href="mailto:contact@linto.ai" target="_blank">mailto:contact@linto.ai</a>
          </div>
        </div>
        <div class="flex col flex1 padding-20">
          <div class="flex row contact-item align-center">
            <span class="icon mail"></span>
            <span class="info">Email: <a href="mailto:contact@linto.ai" target="_blank">contact@linto.ai</a></span>
          </div>
          <div class="flex row contact-item align-center">
            <span class="icon phone"></span>
            <span class="info">Téléphone: 01 02 03 04 05</span>
          </div>
          <div class="flex row contact-item align-center">
            <span class="icon map"></span>
            <span class="info">Addresse : 32 rue Pierre-Paul Riquet, 31300, Toulouse</span>
          </div>
          <div class="mapouter">
            <div class="gmap_canvas">
              <iframe width="100%" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=32%20Rue%20Pierre-Paul%20Riquet,%2031000%20Toulouse&t=&z=17&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe><a href="https://123movies-to.org"></a><br><a href="https://www.embedgooglemap.net">embedding google map</a>
              }</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<script type="text/javascript" src="/assets/js/contact.js"></script>