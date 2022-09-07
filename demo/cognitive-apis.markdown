---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Essayer LinTO cognitive APIs dans votre navigateur
---
<div id="body" class="flex col">
  <section>
    <div class="container flex col">
      <h1 class="big-title centered">Tester <strong class="blue">l'API de transcription</strong> par fichier</h1>
      <p class="thin text-centered">Réalisez une transcription en utilisant un fichier audio ou vidéo d’une taille maximale de 10Mo, ou en parlant directement dans votre micophone.</p>
      <div id="api-transcription-container" class="flex row">
        <div class="flex row flex3 padding-20">
          <div class="flex col flex1">
            <div class="flex col api-transcription-field">
              <span class="field-label">Type de transcription</span>
              <div class="flex row align-center" style="margin-top: 5px;">
                <input type="radio" id="api-setting-mic" name="api-input-type" value="mic" checked>
                <label for="api-setting-mic" class="input-label">Microphone</label>
                <input type="radio" id="api-setting-file" name="api-input-type" value="file" >
                <label for="api-setting-file" class="input-label">Fichier</label>
              </div>
            </div>
            <div class="flex col api-transcription-field">
              <span class="field-label">Langue</span>
              <div class="flex row">
                <select id="api-transcription-language" class="api-transcription-select">
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
          <div class="flex col flex1">
            <div class="api-transcription-field">
              <span class="field-label">Identification des locuteurs</span>
              <div class="row">
                <button id="api-transcription-diarization" class="toggle-input">
                  <span class="toggle-icon"></span>
                </button>
              </div>
            </div>
            <div class="flex col api-transcription-field">
              <span class="field-label">Nombre de locuteurs</span>
              <div class="flex row">
                <select id="api-transcription-speakers" class="api-transcription-select" disabled>
                  <option value="1">1 locuteur</option>
                  <option value="2">2 locuteurs</option>
                  <option value="3">3 locuteurs</option>
                  <option value="4">4 locuteurs</option>
                  <option value="5">5 locuteurs</option>
                  <option value="6">6 locuteurs</option>
                  <option value="7">7 locuteurs</option>
                  <option value="8">8 locuteurs</option>
                  <option value="9">9 locuteurs</option>
                  <option value="10">10 locuteurs</option>
                  <option value="11">11 locuteurs</option>
                  <option value="12">12 locuteurs</option>
                </select>
              </div>
            </div>
            <div class="flex col api-transcription-field">
              <span class="field-label">Restitution de la ponctuation</span>
              <button id="api-transcription-punctuation" class="toggle-input">
                <span class="toggle-icon"></span>
              </button>
            </div>
          </div>
        </div>
        <div class="flex col flex1 justify-center api-transcription-btn-container padding-20">
          <div id="api-transcription-upload-field" class="hidden">
            <input type="file" id="api-transcription-file" ref="api-transcription-file" class="hidden" onchange="handleFileUpload">
            <label for="api-transcription-file" id="api-transcription-file-btn">
              <span class="icon"></span>
              <span class="label" id="api-transcription-file-label">Fichier média</span>
            </label>
          </div>
          <button class="api-transcription-btn red" href="javascript:;" id="api-transcription-mic-btn" alt="Enregistrer"> 
            <span class="icon icon-mic"></span> 
            <span class="label">Enregistrer</span> 
          </button> 
          <button class="api-transcription-btn blue hidden" href="javascript:;" id="api-transcription-play-btn" alt="Ecouter"> 
            <span class="icon icon-play"></span> 
            <span class="label">Ecouter</span> 
          </button> 
          <button class="api-transcription-btn green hidden" href="javascript:;" id="api-transcription-transcript-btn" alt="Transcription"> 
            <span class="icon icon-download"></span> 
            <span class="label">Transcription</span> 
          </button> 
        </div>
      </div>
      <div id="api-transcription-state">
        <div class="api-transcription-step hidden" id="api-transcription-step-start" data-step="start">Envoi du fichier</div>
        <div class="api-transcription-step hidden" id="api-transcription-step-transcription" data-step="transcription">Transcription</div>
        <div class="api-transcription-step hidden" id="api-transcription-step-diarization" data-step="diarization">Identification des locuteurs</div>
        <div class="api-transcription-step hidden" id="api-transcription-step-punctuation" data-step="punctuation">Ponctuation</div> 
      </div>
      <div id="api-transcription-result-container" class="col hidden">
        <div class="api-transcription-field flex row inline align-center" style="margin: 20px 0;">
          <span class="field-label ">Normalisation des chiffres</span>
          <div class="row">
            <button id="api-transcription-normalization" class="toggle-input">
              <span class="toggle-icon"></span>
            </button>
          </div>
        </div>
        <div class="flex row">
          <div class="flex row flex1 justify-center align-center">
            <button class="transcription-result-btn active" id="api-transcription-result-json">Json</button>
          </div>
          <div class="flex row flex1 justify-center align-center">
            <button class="transcription-result-btn" id="api-transcription-result-text">Texte</button>
          </div>
          <div class="flex row flex1 justify-center align-center">
            <button class="transcription-result-btn" id="api-transcription-result-srt">Sous-titre (.srt)</button>
          </div>
          <div class="flex row flex1 justify-center align-center">
            <button class="transcription-result-btn" id="api-transcription-result-vtt">Sous-titre (.vtt)</button>
          </div>
        </div>
        <div class="flex col" id="api-transcription-result"></div>
        <div class="flex row api-transcription-download">
          <a id="transcription-download" class="btn-cta blue">Télécharger</a>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="container flex col">
      <h2 class="big-title centered">Tester la <strong class="blue">dictée vocale</strong></h2>
      <p class="thin text-centered">Parlez dans votre <strong>microphone</strong> et obtenez une <strong>transcription en temps réel</strong>.<br/>
      Cliquez sur le bouton micophone pour <strong>démarrer la dictée</strong>.<br/>
      Pour arrêter l'enregistrement cliquez sur le bouton micophone pour ou dites <strong>"STOP"</strong>.</p>
        <div class="flex row justify-center">
        <div class="api-streaming-container flex row align-center">
          <button id="record-streaming" ><span class="rec-icon"></span></button>
          <div id="record-streaming-transcript" class="flex1 flex col"></div>
      </div>
    </div>
  </div>
</section>

</div>

<script type="text/javascript" src="/assets/js/linto.min.js"></script>
<script type="text/javascript" src="/assets/js/cognitive-apis-demo.js"></script>