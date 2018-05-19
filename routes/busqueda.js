var express = require('express');
var app = express();

var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario')

// =====================================================
// Busqueda especifica
// =====================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    /*  var busqueda = req.params.busqueda;
      var regex = new RegExp(busqueda, 'i');
      var tabla = req.params.tabla

      if (tabla === 'medico') {
          Promise.all([buscarMedicos(busqueda, regex)]).then(
              respuestas => {
                  res.status(200).json({
                      ok: 'true',
                      medicos: respuestas[0]
                  });
              }
          );
      } else if (tabla === 'hospital') {
          Promise.all([buscarHospitales(busqueda, regex)]).then(
              respuestas => {
                  res.status(200).json({
                      ok: 'true',
                      medicos: respuestas[0]
                  });
              }
          );
      } else if (tabla === "usuario") {
          Promise.all([buscarUsuarios(busqueda, regex)]).then(
              respuestas => {
                  res.status(200).json({
                      ok: 'true',
                      medicos: respuestas[0]
                  });
              }
          );
      }
      */

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda solo son : usuarios , hospitales y medicos'
            });
    }

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });


});

// =====================================================
// Busqueda general
// =====================================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: 'true',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })
        });
});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hopsitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hopsital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar los medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    })
}


function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;