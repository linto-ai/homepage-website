window.onload = async function() {
  try {
      let host = window.location.hostname;
      let lintoWebToken = '';
      if (host.indexOf('dev.linto.local') >= 0) {
          lintoWebToken = 'wdyEXAlwSFY3WjvD';
      }
      // INIT LINTO AGENT
      window.linto = await new Linto('https://gamma.linto.ai/overwatch/local/web/login', lintoWebToken);
      let login = await window.linto.login()
      if (login) {
          window.linto.startAudioAcquisition(false, 'linto', 0.99)
          window.linto.addEventListener("streaming_start", function() {})
          window.linto.addEventListener("streaming_stop", function() {
              let streamingBtn = document.getElementById('record-streaming')
              if (streamingBtn.classList.contains('recording')) {
                  streamingBtn.classList.remove('recording')
              }
          })
          window.linto.addEventListener("streaming_fail", function(e) {
              window.linto.stopStreaming()
          })
          window.linto.addEventListener("streaming_chunk", function(event) {
              handleStreamingChunk(event)
          })
          window.linto.addEventListener("action_feedback", function(event) {
              //console.log('actions feedback', event)
              updateTranscriptionState(event)
          })
      } else {
          throw ('LinTO Agent: Error on login')
      }
  } catch (lintoError) {
      // handle the error
      console.error(lintoError)
  }

  window.streamingContent = ''
  const handleStreamingChunk = function(event) {
      let writingTarget = document.getElementById('record-streaming-transcript')
      if (event.detail.behavior.streaming.partial && event.detail.behavior.streaming.partial !== 'stop') {
          //console.log("Streaming chunk received : ", event.detail.behavior.streaming.partial)
          if (event.detail.behavior.streaming.partial) {
              writingTarget.innerHTML = window.streamingContent + (window.streamingContent.length > 0 ? '\n' : '') + event.detail.behavior.streaming.partial
          }
      }
      if (event.detail.behavior.streaming.text) {
          //console.log("Streaming utterance completed : ", event.detail.behavior.streaming.text)
          if (event.detail.behavior.streaming.text === 'stop') {
              window.linto.stopStreaming()
              window.streamingContent = ''
          } else {
              window.streamingContent += (window.streamingContent.length > 0 ? '\n' : '') + event.detail.behavior.streaming.text
              writingTarget.innerHTML = window.streamingContent
          }
      }
  }

  /* API TRANSCRIPTION FORM */
  window.transcriptionResultId = ''
  const toggleBtns = document.getElementsByClassName('toggle-input')
  const speakersInput = document.getElementById('api-transcription-speakers')
  const inputTypeMic = document.getElementById('api-setting-mic')
  const inputTypeFile = document.getElementById('api-setting-file')
  const recordBtn = document.getElementById('api-transcription-mic-btn')
  const replayBtn = document.getElementById('api-transcription-play-btn')
  const transcriptionBtn = document.getElementById('api-transcription-transcript-btn')
  const updloadFile = document.getElementById('api-transcription-upload-field')
  const languageInput = document.getElementById('api-transcription-language')
  const punctuationBtn = document.getElementById('api-transcription-punctuation')
  const diarizationBtn = document.getElementById('api-transcription-diarization')
  const normalizationBtn = document.getElementById('api-transcription-normalization')
  const fileInputLabelBtn = document.getElementById('api-transcription-file-btn')
  const fileInput = document.getElementById('api-transcription-file')
  const fileInputLabel = document.getElementById('api-transcription-file-label')

  // Transcription API form: Input type (microphone / media file)
  inputTypeMic.onchange = function() {
      updateApiFormInputType()
  }
  inputTypeFile.onchange = function() {
      updateApiFormInputType()
  }

  function updateApiFormInputType() {
      if (inputTypeMic.checked) {
          recordBtn.classList.remove('hidden')
          replayBtn.classList.add('hidden')
          transcriptionBtn.classList.add('hidden')
          updloadFile.classList.add('hidden')
      } else {
          recordBtn.classList.add('hidden')
          replayBtn.classList.add('hidden')
          transcriptionBtn.classList.add('hidden')
          updloadFile.classList.remove('hidden')
      }
  }

  // Transcription API form: Toggle buttons
  for (let btn of toggleBtns) {
      btn.onclick = async function() {
          btn.classList.contains('selected') ? btn.classList.remove('selected') : btn.classList.add('selected')
          if (btn.getAttribute('id') === 'api-transcription-diarization') {
              if (btn.classList.contains('selected')) {
                  speakersInput.removeAttribute('disabled')
              } else {
                  speakersInput.setAttribute('disabled', 'disabled')
              }
          }

          if (btn.getAttribute('id') === 'api-transcription-normalization') {
              let transcriptionResTypeBtns = document.getElementsByClassName('transcription-result-btn')
              for (let btnType of transcriptionResTypeBtns) {
                  if (btnType.classList.contains('active')) {
                      let btnId = btnType.getAttribute('id')
                      let type = ''
                      if (btnId === 'api-transcription-result-json') {
                          type = 'application/json'
                      } else if (btnId === 'api-transcription-result-text') {
                          type = 'text/plain'
                      } else if (btnId === 'api-transcription-result-srt') {
                          type = 'text/srt'
                      } else if (btnId === 'api-transcription-result-vtt') {
                          type = 'text/vtt'
                      }
                      await window.linto.triggerAction({
                          result_id: window.transcriptionResultId,
                          convert_numbers: btn.classList.contains('selected'),
                          accept: type
                      }, "transcriber", "stt")
                  }
              }
          }
      }
  }

// Transcription API form: Record audio button
  recordBtn.onclick = async function() {
      if (!transcriptionBtn.classList.contains('transcribing')) {
          hideTranscriptionResult()
          hideTranscriptionSteps()
          if (recordBtn.classList.contains('recording')) {
              recordBtn.classList.remove('recording')
              transcriptionBtn.classList.remove('hidden')
              replayBtn.classList.remove('hidden')
              window.linto.audio.recorder.punchOut()
              replayBtn.onclick = function() {
                  window.linto.audio.recorder.play()
              }
          } else {
              recordBtn.classList.add('recording')
              window.linto.audio.recorder.cleanBuffer()
              window.linto.audio.recorder.punchIn()
              replayBtn.classList.add('hidden')
              transcriptionBtn.classList.add('hidden')
          }
      }
  }

  // Transcription API form: Upload file handler
  fileInput.onchange = function(e) {
      handleFileUpload(e)
  }

  async function handleFileUpload(event) {
      let input = event.srcElement
      fileInputLabelBtn.classList.remove('error')
      if (input.files.length > 0) {
          let file = input.files[0]
          let type = file.type
          let limitSize = 10 * 1024 * 1024 // Limit upload size 15MB 
          transcriptionBtn.classList.remove('hidden')
          fileInputLabel.innerHTML = file.name
          if (file.size > limitSize) {
              transcriptionBtn.classList.add('hidden')
              fileInputLabel.innerHTML = "Fichier trop volumineux"
              fileInputLabelBtn.classList.add('error')
          } else {
              if (type.indexOf('audio') >= 0 || type.indexOf('video') >= 0) {
                  // File ok
                  transcriptionBtn.classList.remove('hidden')
                  fileInputLabel.innerHTML = file.name
              } else {
                  // File bad type
                  transcriptionBtn.classList.add('hidden')
                  fileInputLabel.innerHTML = "Fichier audio"
              }
          }
      } else {
          // File not found
          transcriptionBtn.classList.add('hidden')
          fileInputLabel.innerHTML = "Fichier audio"
      }
  }



  // Transcription API form: Send form
  transcriptionBtn.onclick = async function() {
      if (!transcriptionBtn.classList.contains('transcribing')) {
          hideTranscriptionResult()
          hideTranscriptionSteps()
          let payload = await getFormData()
          setTranscriptionSteps(payload)
          window.linto.triggerAction(payload, "transcriber", "stt")
          transcriptionBtn.classList.add('transcribing')

          let transcriptionSteps = document.getElementsByClassName('api-transcription-step')
          for (let state of transcriptionSteps) {
              state.classList.remove('done')
              state.classList.add('pending')
          }
      }
  }

  function blobToBase64(blob) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      return new Promise(resolve => {
          reader.onloadend = () => {
              resolve(reader.result)
          }
      })
  }

  async function getFormData() {
      let transcriptionConfig = {
          transcribePerChannel: false,
          enablePunctuation: false,
          diarizationConfig: {
              enableDiarization: false,
              numberOfSpeaker: 0,
              maxNumberOfSpeaker: 0
          }
      }

      // Input Type
      let inputType = ''
      let audioUrl = ''
      if (inputTypeMic.checked) {
          inputType = 'microphone'
          audioUrl = window.linto.audio.recorder.getFile()
      } else if (inputTypeFile.checked) {
          inputType = 'file'
          audioUrl = URL.createObjectURL(fileInput.files[0])
      }

      // Audio
      let blob = await fetch(audioUrl).then(r => r.blob())
      let base64 = await blobToBase64(blob)

      // Lang
      let lang = languageInput.value

      // punctuation
      transcriptionConfig.enablePunctuation = punctuationBtn.classList.contains('selected')

      //diariazation
      transcriptionConfig.diarizationConfig.enableDiarization = diarizationBtn.classList.contains('selected')
      transcriptionConfig.diarizationConfig.numberOfSpeaker = diarizationBtn.classList.contains('selected') ? parseInt(speakersInput.value) : 0
      transcriptionConfig.diarizationConfig.maxNumberOfSpeaker = diarizationBtn.classList.contains('selected') ? parseInt(speakersInput.value) : 0

      return {
          accept: "application/json",
          force_sync: false,
          no_cache: "true",
          transcriptionConfig,
          audio: base64
      }
  }

  // Transcription API form: Transcriptions steps
  let hideTranscriptionSteps = () => {
      let transcriptionSteps = document.getElementsByClassName('api-transcription-step')
      for (let state of transcriptionSteps) {
          state.classList.remove('done')
          state.classList.remove('pending')
          state.classList.remove('started')
          state.classList.add('hidden')
      }
  }
  let setTranscriptionSteps = (payload) => {
      let diarizationEnabled = payload.transcriptionConfig.diarizationConfig.enableDiarization
      let punctuationEnabled = payload.transcriptionConfig.enablePunctuation

      let transcriptionSteps = document.getElementsByClassName('api-transcription-step')

      for (let step of transcriptionSteps) {
          if (step.getAttribute('data-step') === 'start' || step.getAttribute('data-step') === 'transcription' || (diarizationEnabled && step.getAttribute('data-step') === 'diarization') || (punctuationEnabled && step.getAttribute('data-step') === 'punctuation')) {
              step.classList.remove('hidden')
          }
      }
  }
  let updateTranscriptionState = async(event) => {
      const stateItems = document.getElementsByClassName('api-transcription-step')
      const stateStart = document.getElementById('api-transcription-step-start')
      const stateTranscription = document.getElementById('api-transcription-step-transcription')
      const stateDiarization = document.getElementById('api-transcription-step-diarization')
      const statePunctuation = document.getElementById('api-transcription-step-punctuation')
      if (!!event.detail.behavior.state) {
          let resp = event.detail.behavior
              // file uploaded
          if (resp.state === 'file_uploaded') {
              stateStart.classList.remove('pending')
              stateStart.classList.add('done')
          }
          if (!!resp.steps && resp.steps !== 'undefined') {
              // Diarization
              if (!!resp.steps.diarization && resp.steps.diarization.required) {
                  stateDiarization.classList.remove('done')
                  stateDiarization.classList.remove('pending')
                  stateDiarization.classList.remove('started')
                  stateDiarization.classList.add(resp.steps.diarization.status)
              }
              // Transcription
              if (!!resp.steps.transcription && resp.steps.transcription.required) {
                  stateTranscription.classList.remove('done')
                  stateTranscription.classList.remove('pending')
                  stateTranscription.classList.remove('started')
                  stateTranscription.classList.add(resp.steps.transcription.status)
              }
              // Punctuation
              if (!!resp.steps.punctuation && resp.steps.transcription.punctuation) {
                  statePunctuation.classList.remove('done')
                  statePunctuation.classList.remove('pending')
                  statePunctuation.classList.remove('started')
                  statePunctuation.classList.add(resp.steps.punctuation.status)
              }
          }

          if (resp.state === 'done') {
              for (let step of stateItems) {
                  step.classList.remove('pending')
                  step.classList.remove('started')
                  step.classList.add('done')
                  window.transcriptionResultId = resp.result_id
                  document.getElementById('api-transcription-transcript-btn').classList.remove('transcribing')
              }
              //showDownloadTranscriptionBtns()
              await window.linto.triggerAction({
                  result_id: window.transcriptionResultId,
                  accept: 'application/json'
              }, "transcriber", "stt")
          }
          if (resp.state === "result_received") {
              showTranscriptionResult()
              let resultContainer = document.getElementById('api-transcription-result')

              if (typeof(resp.result) === 'object') {
                  resultContainer.innerHTML = `<pre>${JSON.stringify(resp.result, null, 2)}</pre>`
              } else {
                  let formated = resp.result.replace(/\n/g, '<br/>')
                  resultContainer.innerHTML = formated
              }

              // Download link
              const donwloadLink = document.getElementById('transcription-download')
              donwloadLink.classList.remove('hidden')

              let data = ''
              let filename = ''

              if (resp.type === 'application/json') {
                  filename = 'tanscription.json'
                  data = JSON.stringify(resp.result)
              } else if (resp.type === 'text/plain') {
                  filename = 'tanscription.txt'
                  data = resp.result
              } else if (resp.type === 'text/vtt') {
                  filename = 'tanscription.vtt'
                  data = resp.result
              } else if (resp.type === 'text/srt') {
                  filename = 'tanscription.srt'
                  data = resp.result
              }
              let respFile = URL.createObjectURL(new Blob([data], { type: resp.type }))
              donwloadLink.setAttribute('href', respFile)
              donwloadLink.setAttribute('download', filename)
          }
      }
  }

  const apiResultJsonBtn = document.getElementById('api-transcription-result-json')
  const apiResultTextBtn = document.getElementById('api-transcription-result-text')
  const apiResultSrtBtn = document.getElementById('api-transcription-result-srt')
  const apiResultVttBtn = document.getElementById('api-transcription-result-vtt')
  const apiResultBtns = document.getElementsByClassName('transcription-result-btn')

  let showTranscriptionResult = () => {
      const transcriptionTypesBtns = document.getElementById('api-transcription-result-container')
      transcriptionTypesBtns.classList.remove('hidden')
  }
  let hideTranscriptionResult = () => {
      const transcriptionTypesBtns = document.getElementById('api-transcription-result-container')
      transcriptionTypesBtns.classList.add('hidden')
      resetApiResultBtns()
      apiResultJsonBtn.classList.add('active')
  }
  let resetApiResultBtns = () => {
      for (let btn of apiResultBtns) {
          btn.classList.remove('active')
      }
  }
  apiResultJsonBtn.onclick = async() => {
      if (window.transcriptionResultId !== '') {
          resetApiResultBtns()
          apiResultJsonBtn.classList.add('active')
          await window.linto.triggerAction({
              result_id: window.transcriptionResultId,
              convert_numbers: normalizationBtn.classList.contains('selected'),
              accept: 'application/json'
          }, "transcriber", "stt")
      }
  }
  apiResultTextBtn.onclick = async() => {
      if (window.transcriptionResultId !== '') {
          resetApiResultBtns()
          apiResultTextBtn.classList.add('active')
          await window.linto.triggerAction({
              result_id: window.transcriptionResultId,
              convert_numbers: normalizationBtn.classList.contains('selected'),
              accept: 'text/plain'
          }, "transcriber", "stt")
      }
  }
  apiResultSrtBtn.onclick = async() => {
      if (window.transcriptionResultId !== '') {
          resetApiResultBtns()
          apiResultSrtBtn.classList.add('active')
          await window.linto.triggerAction({
              result_id: window.transcriptionResultId,
              convert_numbers: normalizationBtn.classList.contains('selected'),
              accept: 'text/srt'
          }, "transcriber", "stt")
      }
  }
  apiResultVttBtn.onclick = async() => {
      if (window.transcriptionResultId !== '') {
          resetApiResultBtns()
          apiResultVttBtn.classList.add('active')
          await window.linto.triggerAction({
              result_id: window.transcriptionResultId,
              convert_numbers: normalizationBtn.classList.contains('selected'),
              accept: 'text/vtt'
          }, "transcriber", "stt")
      }
  }

  /* STREAMING API */
  
  const micStreamingBtn = document.getElementById('record-streaming')
  const streamingContent = document.getElementById('record-streaming-transcript')
  micStreamingBtn.onclick = function(e) {
      if (micStreamingBtn.classList.contains('recording')) {
          micStreamingBtn.classList.remove('recording')
          window.linto.stopStreaming()
          window.streamingContent = ''
      } else {
          micStreamingBtn.classList.add('recording')
          streamingContent.innerHTML = ''
          window.linto.startStreaming(0)
      }
  }

}