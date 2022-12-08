window.addEventListener('load', function () {
  const button = document.getElementById('send-code')
  const input = document.getElementById('email')

  button.addEventListener('click', function () {
    const email = input && input.value

    if (!email) {
      alert('Se necesita un correo electrónico')
      return
    }

    const body = JSON.stringify({ email })
    const headers = { 'Content-Type': 'application/json' }
    const promise = fetch('/_/code', { method: 'POST', body, headers })

    promise.then(function (response) {
      if (response.ok) {
        alert('Código enviado')
      } else {
        alert('No se pudo enviar el código')
      }
    })
  })
})
