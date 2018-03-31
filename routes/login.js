var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../confiig/config').SEED;

var Usuario = require('../models/Usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'No existe el usuario en la base de datos',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compare(usuarioDB.password, body.password)) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Pleca usa una carita sonriente yo pongo esto.
        usuarioDB.password = undefined;
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400000 });

        return res.status(200).json({
            ok: true,
            mensaje: usuarioDB,
            token: token,
            id: usuarioDB.id
        });


    });


});


module.exports = app;