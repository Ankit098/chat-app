const socket = io()

// DOM elements
const $messageForm = document.querySelector('#mesgForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#location')
const $messages = document.querySelector('#messages')

window.onload = $messageFormInput.focus()

socket.on('message', (message) => {
  const markup = `<div> <p>${message}</p> </div>`;
  $messages.insertAdjacentHTML('beforeend', markup)
})

socket.on('locationMessage', (message) => {
  const markup = `<div> 
    <a 
      href=${message} 
      target='_blank' 
      rel='noopener noreferrer'
    > 
      My location 
    </a> 
  </div>`;
  $messages.insertAdjacentHTML('beforeend', markup)
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
