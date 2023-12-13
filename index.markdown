---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: LinTO, framework open-source de technologies vocales
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-player/1.4.3/lottie-player.js"></script>

<div id="body" class="flex col">
  <section id="homepage-top">
    <div class="container flex col">
      <h1 class="big-title">LinTO, <strong class="green">framework Open Source</strong> de technologies vocales</h1>
      <div class="homepage-title-links flex row">
        <a href="https://github.com/linto-ai" target="_blank" class="github-logo">
          <span class="icon github dark"></span>
        </a>
        <a href="https://github.com/orgs/linto-ai/projects/6" class="btn-cta dark" target="_blank" >Roadmap</a>
      </div>  
    </div>  
    <div class="container flex row">
      <div class="flex col flex1 padding-20">
        <div class="flex col homepage-links-container">
          <button class="homepage-link apis" data-anim="coginitve-apis">
            <span class="icon apis"></span>
            <span class="label">Cognitive APIs</span>
            <div class="homepage-link-detail flex col">
              <p class="detail">Intégrez des fonctions de reconnaissance vocale et de compréhension de la parole dans vos applications.</p>
                <div class="flex row detail-btn flex1">
                  <a href="/produits/cognitive-apis" class="btn-cta homepage bluechart">En savoir plus...</a>
                  <a href="/demo/cognitive-apis" class="btn-cta homepage bluechart">Démo sur navigateur</a>
              </div>
            </div>
          </button>
          <button class="homepage-link flex row align-center meeting" data-anim="smart-meeting">
            <span class="icon meeting"></span>
            <span class="label">Smart meetings</span>
            <div class="homepage-link-detail flex col">
              <p class="detail">Enregistrez vos réunions et réalisez des transcription directement en streaming ou à partir de fichiers média.</p>
              <div class="flex row detail-btn flex1">
                <a href="/produits/linto-for-meeting" class="btn-cta homepage greenchart">En savoir plus...</a>
                <a href="https://studio.linto.app/" target="_blank" class="btn-cta homepage greenchart">Linto Studio Accès anticipé</a>
              </div>
            </div>
          </button>
          <button class="homepage-link flex row align-center linto" data-anim="linto-agent">
            <span class="icon linto"></span>
            <span class="label">Virtual agents</span>
            <div class="homepage-link-detail flex col">
              <p class="detail">Platforme Open Source d'agents conversationnels portables (web, voicebot, chatbot, assistants vocaux...). La voix ou le texte comme interface utilisateur naturelle.</p>
              <div class="flex row detail-btn flex1 align-center">
                <a href="/produits/linto-agent" class="btn-cta homepage purplechart">En savoir plus...</a>
                <a href="/demo/linto-agent" class="btn-cta homepage purplechart">Démo sur navigateur</a>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="flex row justify-center align-center padding-20 homepage-animation-mask-container">
        <div id="homepage-animation-mask" class="default flex col align-center justify-center"></div>
      </div>
    </div>
  </section>
  <section id="homepage-privacy">
    <div class="container">
      <h2 class="big-title centered"><strong class="white">Performances, économies et respect</strong> de la vie privée</h2>
      <p class="text-centered">Une alternative Open Source complète à Dialogflow, Google Assistant, Alexa, IBM Watson, Azure cognitive services... Pour ajouter l’usage de la voix et du langage naturel à vos métiers digitaux. Les solutions LinTO proposent un niveau de performance et un coût d’exploitation inédits sur le marché des technologies vocales tout en garantissant :</p>
      <div class="flex row justify-center">
        <div class="flex col content-white-80 padding-20" style="max-width:640px">
          <ul>
            <li>Les performances avantageuses des modèles & APIs développés par <a href="https://labs.linagora.com/our-team/">l'équipe LinTO</a></li>
            <li>L'utilisation <a href="https://doc.linto.ai/docs/developpers/apis/ASR/models">d'autres modèles Open Source </a></li>
            <li>Le respect de la vie privée des usagers </li>
            <li>Le respect du RGPD </li>
            <li>Pas de GAFAM / Pas d'application du droit extra territorial états-unien </li>
            <li>L'hébergement en France ou sur vos infrastructures </li>
            <li>La souveraineté absolue des données </li>
            <li>L’adaptabilité à vos métiers (lexiques spécifiques / conditions acoustiques) </li>
            <li>Le désenclavement des platformes matérielles grace à une compatibilité complète du vocal dans les applications web</li>
            <li>Des mots réveils personnalisés 100% logiciels</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container">
      <h2 class="big-title centered"><strong class="green">Open Source</strong> et dédié à la communauté des développeurs</h2>
      <p class="text-centered">Déployez n’importe quel service LinTO sur vos infrastructures. Bénéficiez de la plus grande base de code de technologies vocales Open Source du monde et de sa documentation associée pour développer votre innovation.</p>
    </div>
    <div class="flex row justify-center btn-cta-container">
      <a class="btn-cta blue" href="https://doc.linto.ai/" target="_blank">Documentation développeurs</a>
    </div>
  </section>
</div>

<script type="text/javascript" src="/assets/js/homepage.js"></script>