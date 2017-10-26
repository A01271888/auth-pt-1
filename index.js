// 1) Inicializar los pluggins y la applicación
var express = require('express');
var basicAuth = require('basic-auth');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
// 2) Declarar las URLs del servidor
app.get('/cookie-only', function(req, res){
  // Leer las cookies previamente enviadas
  let userId = req.cookies.user_id;

  console.log("Cookies: ", req.cookies);

  if(userId && userId.length != 0){
      res.send('Welcome user ' + userId);
  } else{
      res.send('Private area for logged users only!');
  }
});

app.get('/', function(req, res){
  // Aqui enviamos una cookie: res.cookie
  res.cookie('private-info', 'fskPassword', {
    secure: true;
  });

  res.cookie('track', new Date().toISOString(), {
    httpOnly: true, // para que no pueda ser accedida con JavaScript
    path:'/ads'
  });

  res.cookie('_lang', 'ES-MX', {
    maxAge: 1000 * 30,
    path:'/'
  });

  var credentials = basicAuth(req);
  // {name: '', pass: ''} <- eso es lo que debería enviar
  // null <- si no manda nada

  // 4) Verificamos que las credenciales ean correctas
  if(!!credentials && credentials.name == 'john' && credentials.pass == 'secret'){
    res.cookie('user_id', 1, {
      path: '/cookie-only'
    });
    return res.send('Hello World! c:');
  } else{
    res.clearCookie('user_id'); // res.cookie('user_id', null);
    return res.send('Access denied >:c')
  }

});


// 3) Encender el servidor web en un puerto
app.listen(3000, function(){
  console.log('Server on: http://localhost:3000');
});
