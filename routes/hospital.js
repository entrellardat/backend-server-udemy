'use strict'
var Hospital = require('../models/Hospital');

var express = require('express');

var app = express();

var mdAuthentication = require('../middlewares/autenticacion');



// =====================================================
// Obtener hospital por id
// ======================================================

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un hospital con ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
});


// =====================================================
// Obtener todos los hospitales
// =====================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).send({
                    ok: 'false',
                    message: 'No se ha podido realizar la consulta'
                });
            }

            Hospital.count({}, (err, contador) => {
                if (err) {
                    return res.status(500).send({
                        ok: 'false',
                        message: 'No se ha podido realizar la consulta'
                    });
                }

                return res.status(200).send({
                    ok: 'true',
                    hospitales: hospitales,
                    contador: contador
                });

            });

        });
});

// =====================================================
// Crear un nuevo hospital
// =====================================================
app.post('/', mdAuthentication.verficaToken, (req, res) => {
    var body = req.body; // obtenemos el hospital
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
        img: null
    });


    hospital.save((err, hospitalStored) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        return res.status(200).json({
            ok: 'true',
            hospital: hospitalStored
        });
    });

});



// =====================================================
// Borrar hospital
// =====================================================
app.delete('/:id', mdAuthentication.verficaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                mensaje: 'Error al eliminar el hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: 'false',
                mensaje: 'no existe un hospoital con ese id',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });

    });
});

// =====================================================
// Actualizar el hospital
// =====================================================
app.put('/:id', mdAuthentication.verficaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            console.log(hospitalGuardado);
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});



/*
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var update = req.body;

    var hospital = new Hospital();
    hospital = req.body;

    Hospital.findByIdAndUpdate(id, hospital, { new: true }, (err, hospitalActualizado) => {
        if (err)
            return res.status(500).json({ ok: 'false', message: 'Error al actualizar el hospital', err: err });

        if (!hospitalActualizado)
            return res.status(404).json({ message: 'No se ha podido actualizar' });

        return res.status(200).json({ ok: 'true', hospital: hospitalActualizado });
    });

});
*/

module.exports = app;