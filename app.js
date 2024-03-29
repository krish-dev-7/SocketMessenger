var express = require('express');
var app = require('express')();
const path = require('path')
var server = require('http').Server(app);
var io = require('socket.io')(server);

var allUsers = [];


//static folder
// app.use(express.static(path.join(__dirname,'web')));

function emitUsers() {
    io.emit('users',allUsers);    
    console.log('users',allUsers);
}
function removeUser(user) {
    allUsers= allUsers.filter(function(ele){ 
        return ele != user; 
    });   
}

//socket listeners
io.on('connection', function (socket) {
    console.log("inside");
    var userName = socket.request._query.userName;
    allUsers.push(userName);
    emitUsers();
    var msg = `${userName} has joined!`;
    console.log(msg)

    //broadcast when a user connects
    io.emit('message', {
        "message": msg
    }
    );
    socket.on('disconnect', () => {       
      
        var disMsg = `${userName} has disconnected!`;
        console.log(disMsg);
        io.emit('message', {
            "message": disMsg,
        });
        removeUser(userName);
        emitUsers()
    });

    socket.on('message', (data) => {
        console.log(`👤 ${data.userName} : ${data.message}`)
        io.emit('message', data);
    });



});



const PORT = process.env.PORT;
if(!PORT){ throw new Error('port must be specified');}
app.get('/', (req, res) => {
    res.send("Server runnning at port :"+PORT);
}); 
server.listen(PORT,()=>{
    console.log('Server up and running at',PORT);
});