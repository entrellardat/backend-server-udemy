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