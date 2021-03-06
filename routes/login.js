const { OAuth2Client } = require('google-auth-library');

var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../confiig/config').SEED;
var Usuario = require('../models/Usuario');
var CLIENT_ID = require('../confiig/config').CLIENT_ID;
var GOOGLE_SECRET = require('../confiig/config').GOOGLE_SECRET;


// ==================================================================
// AUTENTICACION GOOGLE 
// ==================================================================
app.post('/google', (req, res) => {

    const client = new OAuth2Client(CLIENT_ID, GOOGLE_SECRET);

    var idToken = req.body.idToken;

    const payload = client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID
    });


    payload.then(data => {
        console.log('token', data);
        Usuario.findOne({ email: data.payload.email }, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: 'false',
                    mensaje: 'No existe el usuario en la base de datos',
                    errors: err
                });
            }

            if (usuario) {
                if (!usuario.google) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe usar su autenticacion normal',
                        errors: err
                    });
                }

                usuario.password = ':)';
                var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400000 });

                return res.status(200).json({
                    ok: true,
                    usuario: usuario,
                    token: token,
                    id: usuario.id,
                    menu: obtenerMenu(usuario.role)
                });

            } else {
                // Si el usuario no existe por correo
                var usuario = new Usuario();
                usuario.nombre = data.payload.name;
                usuario.email = data.payload.email;
                usuario.role = 'ADMIN_ROLE';
                usuario.password = '::(';
                usuario.img = data.payload.picture;
                usuario.google = true;


                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: 'false',
                            mensaje: 'Error al crear usuario',
                            errors: err
                        });
                    }

                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400000 });
                    return res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB.id,
                        menu: obtenerMenu(usuarioDB.role)
                    });

                });
            }
        });
    }).catch(err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }
    });
});

// ==================================================================
// AUTENTICACION NORAML 
// ==================================================================
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

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        console.log('pasando la validacion');


        // Pleca usa una carita sonriente yo pongo esto.
        usuarioDB.password = undefined;
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400000 });


        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });


    });


});

function obtenerMenu(role) {
    let menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                /*  { titulo: 'Usuarios', url: '/usuarios' }, */
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    if (role === "ADMIN_ROLE") {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }); // el unshuif lo pone al principio
    }

    return menu;
}

module.exports = app;