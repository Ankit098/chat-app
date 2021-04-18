const socket = io()

// DOM elements
const $messageForm = document.querySelector('#mesgForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#location')

window.onload = $messageFormInput.focus()

socket.on('message', (message) => {
  console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  $messageFormBtn.setAttribute('disabled', 'disabled')

  socket.emit('sendMessage', $messageFormInput.value, () => {
    $messageFormBtn.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    console.log('Message delivered!')
  })
})

$locationBtn.addEventListener('click', (e) => {
  if(!navigator.geolocation) {
    return alert('Your browser does not support geolocation!')
  }
  $locationBtn.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationBtn.removeAttribute('disabled')
      console.log('Location shared!')
    })
  })
})
