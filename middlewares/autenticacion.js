var SEED = require('../confiig/config').SEED;
var jwt = require('jsonwebtoken');

// =====================================================
// Verificar TOKEN
// =====================================================

exports.verficaToken = function(req, res, next) {
    var token = req.query.token;
    //var token = req.body.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: 'false',
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}


// =====================================================
// Verificar ADMIN
// =====================================================

exports.verficaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE ") {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: 'false',
            mensaje: 'token incorrecto',
            errors: err
        });
    }
}

// =====================================================
// Verificar ADMIN o mismo USUario
// =====================================================

exports.verficaADMIN_ROLE_o_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === "ADMIN_ROLE " || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: 'false',
            mensaje: 'token incorrecto',
            errors: err
        });
    }
}