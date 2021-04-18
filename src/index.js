const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New websocket connection')
  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined the room :)')

  socket.on('sendMessage', (mesg) => {
    io.emit('message', mesg)
  })

  socket.on('sendLocation', (location) => {
    socket.broadcast.emit(
      'message', 
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    )
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the room :(')
  })
})

server.listen(3000, () => console.log(`Server listening on port ${port}`))
