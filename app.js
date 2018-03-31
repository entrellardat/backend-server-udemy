var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});

var moongose = require('mongoose');

moongose.Promise = global.Promise;
moongose.connect('mongodb://localhost:27017/hospitalDB')
    .then(() => {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
    })
    .catch(err => console.log(err));

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// middlewares
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);