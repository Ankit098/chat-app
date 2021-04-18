const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New websocket connection')
  socket.emit('message', generateMessage('Welcome!'))
  socket.broadcast.emit('message', generateMessage('A new user has joined!'))

  socket.on('sendMessage', (mesg, cb) => {
    io.emit('message', generateMessage(mesg))
    cb()
  })

  socket.on('sendLocation', (location, cb) => {
    io.emit(
      'locationMessage', 
      generateLocationMessage(location.latitude, location.longitude)
    )
    cb()
  })

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'))
  })
})

server.listen(3000, () => console.log(`Server listening on port ${port}`))
