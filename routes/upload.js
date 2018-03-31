var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/Usuario');
var Medico = require('../models/Medico');
var Hospital = require('../models/Hospital');



app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValids = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValids.indexOf(tipo) < 0) {
        return res.status(500).send({
            ok: 'false',
            message: 'tipo de coleccion no es valdia',
            errors: { message: 'tipo de coleccion no es valdia' }
        });
    }

    if (!req.files) {
        return res.status(500).send({
            ok: 'false',
            message: 'No se ha podido realizar la consulta',
            errors: { message: 'Debs seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo 
    var archivo = req.files.imagen;
    var extension = archivo.name.split('.');
    extension = extension[extension.length - 1];

    // filtrar las extensiones
    var extensionesValidas = ['jpg', 'png', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).send({
            ok: 'false',
            message: 'extension no valido',
            errors: { message: 'las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {
        if (err) {
            res.status(500).send({
                ok: 'false',
                message: 'error al mover archivo',
                errors: { message: err }
            });
        }
    });

    subirPorTipo(tipo, id, nombreArchivo, res)

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === "usuarios") {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                res.status(500).send({
                    ok: 'false',
                    message: 'no se ha encontrado al usuario',
                    errors: { message: err }
                });
            }

            var pathOld = './uploads/usuarios/' + usuario.imagen;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlink(pathOld);
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    res.status(500).send({
                        ok: 'false',
                        message: 'error al actualizar la imagen del usuario',
                        errors: { message: err }
                    });
                }
                return res.status(200).send({
                    ok: 'true',
                    message: 'imagen de usuario actualizada',
                    archivo: usuarioActualizado
                });
            });
        });
    }

    if (tipo === "medicos") {
        Medico.findById(id, (err, medico) => {

            if (err) {
                res.status(500).send({
                    ok: 'false',
                    message: 'no se ha encontrado al usuario',
                    errors: { message: err }
                });
            }

            var pathOld = './uploads/medicos/' + medico.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlink(pathOld);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    res.status(500).send({
                        ok: 'false',
                        message: 'error al actualizar la imagen del usuario',
                        errors: { message: err }
                    });
                }
                return res.status(200).send({
                    ok: 'true',
                    message: 'imagen de medico actualizada',
                    archivo: medicoActualizado
                });
            });
        });
    }


    if (tipo === "hospitales") {
        Hospital.findById(id, (err, hospital) => {

            if (err) {
                res.status(500).send({
                    ok: 'false',
                    message: 'no se ha encontrado al usuario',
                    errors: { message: err }
                });
            }

            var pathOld = './uploads/hospitals/' + hospital.imagen;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathOld)) {
                fs.unlink(pathOld);
            }

            hospital.imagen = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    res.status(500).send({
                        ok: 'false',
                        message: 'error al actualizar la imagen del usuario',
                        errors: { message: err }
                    });
                }
                return res.status(200).send({
                    ok: 'true',
                    message: 'imagen de hospital actualizada',
                    archivo: hospitalActualizado
                });
            });
        });
    }
}


module.exports = app;