const express = require('express');
const app = express() ;
const http = require('http').createServer(app);
const users = {};

const PORT = process.env.PORT || 5500 ;

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

// Scoket

const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')

    socket.on('userJoined',(name) =>{
        console.log('new user', name)
        users[socket.id] = name;
        socket.broadcast.emit('newUser', name)
    })
    
    socket.on('message',(msg) =>{
        socket.broadcast.emit('message', msg)
        
    })
    socket.on('disconnect',(name) =>{
        console.log(`${users[socket.id]} user left`, name)
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    })
})