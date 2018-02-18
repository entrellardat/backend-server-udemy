var express = require('express');

var app = express();

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

// RUTAS
app.get('/', (req, res, next) => {
    return res.status(200).json({
        ok: 'true',
        mensaje: 'peticion realziada correctamente'
    });
});


/************************************************************************/

/*
moongose.connection.open('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
*/
/********************************************************************* */