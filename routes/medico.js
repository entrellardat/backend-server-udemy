'use strict'
var Medico = require('../models/Medico');

var express = require('express');

var app = express();

var mdAuthentication = require('../middlewares/autenticacion');

// =====================================================
// Obtener todos los medicos
// =====================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).send({
                    ok: 'false',
                    message: 'No se ha podido realizar la consulta'
                });
            }

            Medico.count({}, (err, contador) => {
                if (err) {
                    return res.status(500).json({
                        ok: 'false',
                        mensaje: 'Error en la base de datos',
                        errors: err
                    });
                }
                return res.status(200).send({
                    ok: 'true',
                    medicos: medicos,
                    contador: contador
                });
            });
        });
});

// =====================================================
// Crear un nuevo medico 
// =====================================================
app.post('/', mdAuthentication.verficaToken, (req, res) => {
    var body = req.body; // obtenemos el medico
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });


    medico.save((err, medicoStored) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }

        return res.status(200).json({
            ok: 'true',
            medico: medicoStored
        });
    });

});



// =====================================================
// Borrar medico 
// =====================================================
app.delete('/:id', mdAuthentication.verficaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al eliminar el medico',
                errors: err
            });
        }

        if (!medicoEliminado) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'no existe un medico con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });

    });
});

// =====================================================
// Actualizar el medico
// =====================================================


app.put('/:id', (req, res) => {
    var id = req.params.id;
    var update = req.body;

    var medico = new Medico();
    medico = req.body;

    Medico.findByIdAndUpdate(id, medico, { new: true }, (err, medicoActualizado) => {
        if (err)
            return res.status(500).json({ ok: 'false', message: 'Error al actualizar el medico', err: err });

        if (!medicoActualizado)
            return res.status(404).json({ message: 'No se ha podido actualizar' });

        return res.status(200).json({ ok: 'true', medico: medicoActualizado });
    });

});


module.exports = app;