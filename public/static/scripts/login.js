document.addEventListener('DOMContentLoaded', onLoad)

const globals = {
  senderInput: document.getElementById('sender'),
  senderText: document.getElementById('sender').textContent,
  popupDisposer: undefined,
}

function onLoad() {
  globals.senderInput.addEventListener('click', onSendCodeButtonClick)
}

async function onSendCodeButtonClick() {
  const input = document.getElementById('email')
  const email = input && input.value
  const isEmail = email && email.includes('@')

  if (!email) {
    return openPopup({
      message: 'El correo es requerido',
      description: 'Ingresa tu correo para iniciar sesión',
    })
  }

  if (!isEmail) {
    return openPopup({
      message: 'Te olvidaste del @',
    })
  }

  const response = await sendCode({ email })

  openPopup({
    message: response && response.message,
    description: response && response.description,
  })
}

function setLoading(value) {
  if (value) {
    globals.senderInput.setAttribute('disabled', 'disabled')
    globals.senderInput.innerText = 'Enviando código'
  } else {
    globals.senderInput.removeAttribute('disabled')
    globals.senderInput.innerText = globals.senderText
  }
}

async function sendCode({ email }) {
  const url = '/_/code'
  const body = JSON.stringify({ email })
  const headers = { 'Content-Type': 'application/json' }
  setLoading(true)
  const response = await fetch(url, { method: 'POST', body, headers })
  setLoading(false)

  return await response.json()
}

function openPopup({ message = '', description, duration = 3000 }) {
  const identifier = 'popup'
  const popup = document.getElementById(identifier)
  const content = `
    <span>${message}</span>
    ${description ? `<span name="secondary">${description}</span>` : ''}
  `

  if (popup) {
    popup.remove()
    clearTimeout(globals.popupDisposer)
  }

  const element = document.createElement('div')
  element.id = identifier
  element.innerHTML = content
  element.classList.add('display')
  element.setAttribute('type', 'column')
  document.body.appendChild(element)

  globals.popupDisposer = setTimeout(function () {
    element.classList.remove('display')
  }, duration)
}
