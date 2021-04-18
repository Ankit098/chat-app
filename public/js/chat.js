const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#mesgForm').addEventListener('submit', (e) => {
  e.preventDefault()
  let mesg = e.target.elements.message.value
  socket.emit('sendMessage', mesg)
})

document.querySelector('#location').addEventListener('click', (e) => {
  if(!navigator.geolocation) {
    return alert('Your browser does not support geolocation!')
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  })
})
