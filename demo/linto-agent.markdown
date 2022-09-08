---
layout: default
title: Essayer LinTO agent dans votre navigateur
---
<div id="body" class="flex col">
  <section id="linto-agent-demo-wrapper">
    <div class="container flex col">
      <h1 class="big-title centered">Assistant intelligent et agents conversationnels</h1>
      <p class="text-centered">Testez LinTO dans votre navigateur en sélectionnant les démonstrations disponibles</p>
      <div class="flex row align-center linto-demo-btns">
        <button class="btn-cta blue active linto-agent-demo-btn"  data-target="browser-command-website">
          Navigation Web
        </button>
        <button class="btn-cta dark linto-agent-demo-btn"  data-target="browser-command-meeting-room">
          Salle de réunion
        </button>
        <button class="btn-cta dark linto-agent-demo-btn" data-target="browser-command-coffee-machine">
          Machine à café
        </button>
      </div>
    </div>
    <div class="container">
      <div class="flex row browser-command-wrapper" id="browser-command-website">
        <div class="flex1 flex col browser-commands-container">
            <h3>Commandes</h3>
            <ul class="browser-command-list">
              <li>LinTO, <strong>lis</strong> le titre</li>
              <li>LinTO, <strong>lis</strong> le contenu</li>
              <li>LinTO, bloc <strong>suivant</strong></li>
              <li>LinTO, bloc <strong>précédent</strong></li>
              <li>LinTO, <strong>agrandis</strong> l'image</li>
              <li>LinTO, <strong>réduis</strong> l'image</li>
              <li>LinTO, <strong>active</strong> le mode accessibilité</li>
              <li>LinTO, <strong>désactive</strong> le mode accessibilité</li>
            </ul>
          </div>
          <div class="flex col flex2 browser-demo-container">
            <h3>Lecture et navigation de contenu</h3>
            <div class="browser-control-content-block text-left active" data-content-index="1" id="control-content-1">
              <span class="control-content-title" data-index="1">Lecture du contenu</span>
              <span class="control-content-text" data-index="1">Votre agent conversationnel peut lire des contenus pour vous. Vous pouvez également naviguer à travers différents blocs de contenu à la voix.</span>
            </div>
            <div class="browser-control-content-block text-left" id="control-content-2" data-content-index="2" >
              <span data-index="2" class="control-content-title">Navigation à la voix</span>
              <span class="control-content-text" data-index="2">Utilisez les commandes "bloc suivant" et "bloc précédent" pour naviguer à travers différents blocs de contenus.</span>
            </div>
            <div class="browser-control-content-block text-left" id="control-content-3" data-content-index="3" >
              <span class="control-content-title" data-index="3">Visualisez vos images</span>
              <span class="control-content-text" data-index="3">Demandez à votre agent conversationnel d'agrandire ou de réduire les images présentes dans vos contenus.</span>
          </div>
          <div id="browser-control-img-container" class="flex row align-center justify-center" >
            <button id="browser-control-img-close" class="hidden"><span class="icon"></span></button>
            <img src="/assets/img/linto-animation-pipeline.gif" id="browser-control-img" >
          </div>
        </div>
      </div>
      <!-- Meeting Room -->
      <div class="flex row browser-command-wrapper hidden" id="browser-command-meeting-room">
        <div class="flex1 flex col browser-commands-container">
          <h3>Commandes</h3>
          <ul class="browser-command-list">
            <li>LinTO, <strong>allume</strong> la lumière</li>
            <li>LinTO, <strong>éteins</strong> la lumière</li>
            <li>LinTO, <strong>allume</strong> le projecteur</li>
            <li>LinTO, <strong>éteins</strong> le projecteur</li>
            <li>LinTO, <strong>ouvre</strong> les stores</li>
            <li>LinTO, <strong>ferme</strong> les stores</li>
            <li>LinTO, <strong>diapo</strong> suivante</li>
            <li>LinTO, <strong>diapo</strong> précédente</li>
          </ul>
        </div>
        <div class="flex col flex2 browser-demo-container">
          <div class="browser-command-svg-container">
            {% include meeting-room-svg.html %}
          </div>
        </div>
      </div>
      <!-- Coffee machine -->
      <div class="flex row browser-command-wrapper hidden" id="browser-command-coffee-machine">
        <div class="flex1 flex col browser-commands-container">
          <h3>Commandes</h3>
          <ul class="browser-command-list">
            <li>LinTO, sers moi un <strong>Américano</strong></li>
            <li>LinTO, sers moi un <strong>Latté</strong></li>
            <li>LinTO, sers moi un <strong>Mocha</strong></li>
            <li>LinTO, sers moi un <strong>Macchiato</strong></li>
            <li>LinTO, sers moi un <strong>Espresso</strong></li>
          </ul>
        </div>
        <div class="flex col flex2 browser-demo-container">
          <div class="browser-command-svg-container">
            <svg version="1.1" id="coffe-machine-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" style="enable-background:new 0 0 1000 1000;" xml:space="preserve"></svg> 
          </div>
        </div>
      </div>
    </div>
  </section>
  <div id="widget-wrapper"></div>
</div>
<script type="text/javascript" src="/assets/js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="/assets/js/linto.ui.min.js"></script>
<script type="text/javascript" src="/assets/js/linto-agent-demo.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg-min.js" type="text/javascript"></script>
    