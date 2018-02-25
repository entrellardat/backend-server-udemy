var express = require('express');
var app = express();
var SEED = require('../confiig/config').SEED;
var bcrypt = require('bcryptjs');
var Usuario = require('../models/Usuario');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/autenticacion');


// =====================================================
// Obtener todos los usuarios 
// =====================================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: 'false',
                        mensaje: 'Error en la base de datos',
                        errors: err
                    });
                }

                return res.status(200).send({
                    'ok': true,
                    usuarios
                })
            });
});



// =====================================================
// Actualizar Usuario 
// =====================================================
app.put('/:id', mdAuthentication.verficaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'El usuario con el id' + id + ' no existe',
                errors: { message: 'no existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: 'false',
                    mensaje: 'Error al actualizar usaurio',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            return res.status(200).json({
                ok: 'true',
                usuario: usuarioGuardado
            });
        });


    });


});

// =====================================================
// Crear un nuevo usuario 
// =====================================================
app.post('/', mdAuthentication.verficaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });

    usuario.save((errors, usuarioGuardado) => {
        if (errors) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'Error al crear usuario',
                errors: errors
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        })
    });
});

// =====================================================
// Eliminar un usuario.
// =====================================================

app.delete('/:id', mdAuthentication.verficaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al eliminar el usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'no existe un usuario con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });

    });
});

module.exports = app;