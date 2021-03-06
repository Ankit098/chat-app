const socket = io()

// DOM elements
const $messageForm = document.querySelector('#mesgForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBtn = $messageForm.querySelector('button')
const $locationBtn = document.querySelector('#location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// focus message field on load
window.onload = $messageFormInput.focus()

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight
  console.log('hright', containerHeight, newMessageHeight, scrollOffset)

  if (containerHeight - newMessageHeight <= scrollOffset + 3) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', (message) => {
  const markup = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', markup)
  autoScroll()
})

socket.on('roomData', ({ room, users }) => {
  const markup = Mustache.render(sidebarTemplate, {
    room, 
    users
  })
  $sidebar.innerHTML = markup
})

socket.on('locationMessage', (message) => {
  const markup = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', markup)
  autoScroll()
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
      $messageFormInput.focus()
      console.log('Location shared!')
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if(error) {
    alert(error)
    location.href = '/'
  }
})