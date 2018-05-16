var express = require('express');
var app = express();
var fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {
    var img = req.params.img;
    var tipo = req.params.tipo;

    var path = `./uploads/${ tipo }/${img}`;
    console.log('PROBANDO: ' + path);
    fs.exists(path, existe => {
        if (!existe) {
            path = './assets/no-img.jpg';
        }
        res.sendfile(path);
    });
});

module.exports = app;