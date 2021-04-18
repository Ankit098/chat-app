const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#mesgForm').addEventListener('submit', (e) => {
  e.preventDefault()
  let mesg = e.target.elements.message.value
  socket.emit('sendMessage', mesg)
})