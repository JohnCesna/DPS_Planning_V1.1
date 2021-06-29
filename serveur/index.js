var app = require('express')();
var server = require('http').Server(app);
const mysql = require('mysql2');

 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'dpsplanning'
});

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', function(socket){

  console.log('a user connected');
  
  socket.send('hi im server');

  socket.on('message', function (message) {
    console.log(message);
  });
  
  //request user list
  socket.on('login', function(){

    connection.query(
      'SELECT * FROM `user` ',
      function(err, results, fields) {
        const sendResults=[];
        console.log(results);

        results.forEach(element => {
          sendResults.push({
            id: element.id,
            lastname: element.lastname,
            firstname: element.firstname,
            poste: element.poste,
            admin: !element.admin,
            gestionnaire: !element.gestionnaire,
            recherche: !element.recherche,
            production: !element.production,
            activate: !element.activate          
          });
        });

        socket.emit('login-return',sendResults)
      }
    );

  });

});





server.listen(3030, function(){
  console.log('listening on *:3030');
});