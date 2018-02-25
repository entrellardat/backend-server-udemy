var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    return res.status(200).json({
        ok: 'true',
        mensaje: 'peticion realziada correctamente'
    });
});

module.exports = app;