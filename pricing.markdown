---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: LinTO, prix et services
---
<div id="body" class="flex col">
  
  <!-- Princing Array -->
  <section>
    <div class="container big">
    <h1 class="big-title centered">Tarifs API</h1>
      <table id="pricing-table">
        <thead>
          <th>Type de service</th>
          <th>Offre</th>
          <th>Pour qui ?</th>
          <th>Qualité de service</th>
          <th>Prix</th>
        </thead>
        <tbody>
          <!-- FREE Transcription -->
          <tr>
            <td class="service-name">FREE</td>
            <td>
              <ul>
                <li>Limite à 20Mo/jour-IP en ouvert.</li>
                <li>Limite à 100Mo et/ou 40 requêtes/jour avec une clef API (Nécéssite la création d'un compte LinTO)</li>
                <li>Transcription simple, adapté aux assistants vocaux et aux phrases de commandes</li>
              </ul> 
            </td>
            <td>
              <ul>
                <li>Développeurs, hobbyistes, makers...</li>
                <li>Grand public - Assistants Open Source</li>
                <li>Maquettes / PoC</li>
              </ul>
            </td>
            <td>Sans garantie de service</td>
            <td class="price" style="color:green;"><b>Gratuit</b></td>
          </tr>
          <!-- PREMIUM Transcription -->
          <tr>
            <td class="service-name">BASIC</td>
            <td>
              <ul>
                <li>Pas de limite de taille des fichiers traités</li>
                <li>Temps de traitement contenu, selon une politique de meilleur effort & services hautement disponible</li>
                <li>Accès aux options payantes (ponctuation, identification de locuteurs...)</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Transcription de lots de fichiers</li>
                <li>Transcription de fichiers multi-locuteurs avec option d'identification des participants</li>
                <li>Génération de sous-titres pour vidéos / webcasts / interviews etc...</li>
              </ul>
            </td>
            <td>Services hautement disponibles</td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- PREMIUM Transcription + -->
          <tr>
            <td class="service-name">PREMIUM</td>
            <td>
              <ul>
                <li>Pas de limite de taille des fichiers traités</li>
                <li>Temps de traitement garanti 0.3 (60 minutes transcrites en 20 minutes)</li>
                <li>Accès aux options payantes (ponctuation, identification de locuteurs...)</li>
                <li>Accès aux options payantes avancées de streaming temps réél</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Milieu professionnel</li>
                <li>Transcription de réunions</li>
                <li>Assistants vocaux avec affichage de la dictée</li>
                <li>Agents conversationels</li>
                <li>Interface de dictée</li>
              </ul>
            </td>
            <td>Services hautement disponibles et temps de traitement maîtrisé</td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- DEDICATED Transcription -->
          <tr>
            <td class="service-name">DEDICATED</td>
            <td>
              <ul>
                <li>Modèles dédiés et spécialisés</li>
                <li>Temps de traitement garanti 0.3 (60 minutes transcrites en 20 minutes)</li>
                <li>Options + streaming</li>
                <li>Enpoints dédié pour vos modèles personnalisés</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Milieu professionnel</li>
                <li>Transcription de réunions</li>
                <li>Assistants vocaux avec affichage de la dictée</li>
                <li>Interface de dictée</lI>
                <li>Agents conversationels</li>
                <li>Sous-titrage grand volumes de visioconférences</li>
              </ul>
            </td>
            <td>Services hautement disponibles, dédié à votre activité, temps de traitement maîtrisé</td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- Punctuation -->
          <tr>
            <td class="service-name">Tâche de Ponctuation (Texte)</td>
            <td></td>
            <td></td>
            <td>Services hautement disponibles </td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- Diariazation -->
          <tr>
            <td class="service-name">Tâche de Diarization (Audio)</td>
            <td></td>
            <td></td>
            <td>Services hautement disponibles </td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- NLP -->
          <tr>
            <td class="service-name">Tâches de traitement du langage naturel</td>
            <td></td>
            <td></td>
            <td>Services hautement disponibles </td>
            <td class="price">Annonce prochaine</td>
          </tr>
         <!-- Stream -->
          <tr>
            <td class="service-name">Transcription en temps réél (Flux audio)</td>
            <td></td>
            <td></td>
            <td>Service temps réél, hautement disponible</td>
            <td class="price">Annonce prochaine</td>
          </tr>
          <!-- Jitsi with LinTO -->
          <tr>
            <td class="service-name">Jitsi with LinTO</td>
            <td></td>
            <td></td>
            <td>Service temps réél, hautement disponible </td>
            <td class="price">Veuillez nous contacter</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="flex row">
        <div class="flex1 flex col padding-20">
          <h3>Participer au programme LinTO Beta</h3>
          <ul>
            <li>Comprend une clé d'API illimitée permettant d'accéder à tous les types de services LinTO</li>
            <li class="cross">Ne comprend pas de garantie de service</li>
            <li class="cross">Peut être interrompu à n'importe quel moment</li>
          </ul>
        </div>
        <div class="flex1 flex col padding-20">
          <h3>Pour quoi ?</h3>
          <ul>
            <li>Utilisations illimitée des APIs</li>
            <li>Transcription</li>
            <li>Identification des locuteurs</li>
            <li>Ponctuation</li>
            <li>Normalisation des chiffres/nombres</li>
            <li>Export aux formats Txt, Json, sous-titres</li>
          </ul>
        </div>
        <div class="flex1 flex col padding-20">
          <h3>Après la Beta publique ?</h3>
          <ul>
            <li>Votre compte est conservé</li>
            <li>Compte prépayé ou paiement par CB</li>
            <li>Accès aux services Basic et Premium</li>
            <li>Usega des options payantes</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</div>