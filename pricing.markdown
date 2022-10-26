---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: LinTO, prix et status des services
---
<div id="body" class="flex col">
  
  <!-- Princing Array -->
  <section>
    <div class="container big">
    <h1 class="big-title centered">Tarifs API</h1>
      <table id="pricing-table">
        <thead>
          <th>Service</th>
          <th>Offre</th>
          <th>Pour qui ?</th>
          <th>QoS</th>
          <th>Licensing</th>
          <th>Prix</th>
        </thead>
        <tbody>
          <!-- FREE Transcription -->
          <tr>
            <td class="service-name">FREE Transcription</td>
            <td>
              <ul>
                <li>Limite à 40Mo/jour-IP en ouvert.</li>
                <li>Limite à 700Mo Ou 40 requêtes/jour ave une clef API</li>
                <li>transcription simple, adapté aux assistants vocaux. Best effort sans garantie de service.</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Grand public - Assistants Open Source</li>
                <li>Maquette / PoC</li>
              </ul>
            </td>
            <td>0</td>
            <td>0</td>
            <td class="price">gratuit</td>
          </tr>
          <!-- PREMIUM Transcription -->
          <tr>
            <td class="service-name">PREMIUM Transcription</td>
            <td>
              <ul>
                <li>Pas de limite de taille</li>
                <li>Best effort sur le temps de transcription mais Garantie de dispo du service </li>
                <li> Mise à dispo d’options payantes (ponctuation, identification de locuteurs) sur base d’un compte rechargeable</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Transcription de lots de fichiers</li>
                <li>Transcription de fichiers multi-locuteurs avec option Diarization</li>
                <li>Génération de sous-titres pour vidéos / Webcasts etc.</li>
              </ul>
            </td>
            <td>1</td>
            <td>Si déploiement on prem seuls les modèles génériques large-vocabulaire sont dispos. Un usage de modèle dédié —> Offre DEDICATED</td>
            <td class="price">0.50 €/h</td>
          </tr>
          <!-- PREMIUM Transcription + -->
          <tr>
            <td class="service-name">PREMIUM Transcription +</td>
            <td>
              <ul>
                <li>Pas de limite de taille</li>
                <li>RTF Garanti 0.3</li>
                <li> Options + streaming</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Milieu professionnel</li>
                <li>Transcription de réunions</li>
                <li>Assistants vocaux avec affichage de la dictée</li>
                <li>Agents conversationels</li>
              </ul>
            </td>
            <td>2</td>
            <td>0</td>
            <td class="price">1 €/h</td>
          </tr>
          <!-- DEDICATED Transcription -->
          <tr>
            <td class="service-name">DEDICATED Transcription</td>
            <td>
              <ul>
                <li>Modèle accoustic/language Custom</li>
                <li>RTF Garanti 0.3</li>
                <li> Options + streaming</li>
                <li>Services customs (API endpoints) pour les modèles de clients</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Milieu professionnel</li>
                <li>Transcription de réunions</li>
                <li>Assistants vocaux avec affichage de la dictée</li>
                <li>Agents conversationels</li>
                <li>Sous-titrage grand volumes de visios</li>
              </ul>
            </td>
            <td>3</td>
            <td>
              <p>Dans tous les cas, les données permettant de créér les modèles restent fermées chez LINAGORA.</p>
              <p>En cas d'usage SaaS : Un / plusieurs modèles custom est (sont) "offert(s)" / adaptés aux métiers.</p>
              <p>Le contrat doit établir les modalités financières / volume de modèles à créer par ans</p>
              <p>Si le client souhaite utiliser les modèles on prem il doit absorber un coût lié à l’achat du/des modèle(s).</p>
              <p>Si LINAGORA réalise une presta de type support / SLA... —> On peut étudier une ristourne sur là cession du modèles
              </p>
            </td>
            <td class="price">1.50 €/h</td>
          </tr>
          <!-- Punctuation -->
          <tr>
            <td class="service-name">Punctuation</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="price">2 €/h</td>
          </tr>
          <!-- Diariazation -->
          <tr>
            <td class="service-name">Diarization</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="price">2.50 €/h</td>
          </tr>
          <!-- NLP -->
          <tr>
            <td class="service-name">NLP</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="price">2 €/h</td>
          </tr>
         <!-- Stream -->
          <tr>
            <td class="service-name">Stream</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="price">3 €/h</td>
          </tr>
          <!-- Jitsi with LinTO -->
          <tr>
            <td class="service-name">Jitsi with LinTO</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="price">2 €/h</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="flex row">
        <div class="flex1 flex col padding-20">
          <h3>Compte en version BETA</h3>
          <ul>
            <li>Comprend une clé d'API illimitée permettant d'accéder à tous les services LinTO publics.</li>
            <li class="cross">Ne comprend pas de garantie de service</li>
            <li class="cross">Peut être interrompu à n'importe quel moment</li>
          </ul>
        </div>
        <div class="flex1 flex col padding-20">
          <h3>Features</h3>
          <ul>
            <li>Accès gratuit au Conversation Manager</li>
            <li>Utilisations illimitée des APIs</li>
            <li>Transcription</li>
            <li>Identification des locuteurs</li>
            <li>Ponctuation</li>
            <li>Normalisation des chiffres/nombres</li>
            <li>Export aux formats Txt, Json, sous-titres</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>