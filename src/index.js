const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('New websocket connection')

  socket.on('join', ({ username, room }, cb) => {
    const { user, error } = addUser({ id: socket.id, username, room })
    if (error) {
      return cb(error)
    }

    // if user is successfully added
    socket.join(user.room)
    socket.emit('message', generateMessage('Admin', 'Welcome!'))
    socket.broadcast.to(user.room).emit(
      'message', 
      generateMessage('Admin', `${user.username} has joined the room!`)
    )
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    cb()
  })

  socket.on('sendMessage', (mesg, cb) => {
    const user = getUser(socket.id)
    if(user) {
      io.to(user.room).emit('message', generateMessage(user.username, mesg))
      cb()
    }
  })

  socket.on('sendLocation', (location, cb) => {
    const user = getUser(socket.id)
    if(user) {
      io.to(user.room).emit(
        'locationMessage', 
        generateLocationMessage(user.username, location.latitude, location.longitude)
      )
      cb()
    }
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user) {
      io.to(user.room).emit(
        'message', 
        generateMessage('Admin', `${user.username} has left the room!`)
      )
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })
})

server.listen(3000, () => console.log(`Server listening on port ${port}`))
