var express  = require('express');
var app      = express();
var http     = require('http').Server(app);
var io       = require('socket.io')(http);

app.use('/', express.static(__dirname + '/public'));

http.listen( (process.env.PORT || 3000), function(){
    console.log('listening on *:3000');
});
var balls = [];
io.on('connection', function(socket) {
    var id = socket.id;
    balls.push({
        id: id
    });

    socket.emit('connected', id);
    console.log('numBalls', balls.length);
    
    socket.on('ballMove', function(obj) {
        // console.log('obj', obj);
        var ball = getBallById(id);
        ball.pos = obj.pos;
        io.emit('update', balls);
    });
    
    socket.on('disconnect', function () {
        for(var i=0; i<balls.length; i++) {
            if(balls[i].id == id) {
                balls.splice(i, 1);
                break;
            }
        }
        console.log('balls', balls.length);
    });


});

function getBallById(id) {
    for(var i=0; i<balls.length; i++) {
        if(balls[i].id == id) {
            return balls[i];
        }
    }
}