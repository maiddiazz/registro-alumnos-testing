const express = require('express');

const app = express();

const PORT = 3000;

// Permite recibir JSON
app.use(express.json());

// Lista temporal de alumnos
let alumnos = [];

// Endpoint para registrar alumnos
app.post('/alumnos', (req, res) => {

    const { nombre, apellido, id } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellido || !id) {
        return res.status(400).json({
            error: 'Faltan campos obligatorios'
        });
    }
    if (id <= 0) {
    return res.status(400).json({
        error: 'El ID debe ser mayor que cero'
    });
    }

    // Crear alumno
    const nuevoAlumno = {
        nombre,
        apellido,
        id,
        notas: []
    };

    // Guardar en lista
    alumnos.push(nuevoAlumno);

    // Respuesta exitosa
    res.status(201).json({
        mensaje: 'Alumno registrado correctamente',
        alumno: nuevoAlumno
    });
});

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

app.post('/alumnos/:id/notas', (req, res) => {

    const idAlumno = req.params.id;
    const { materia, nota } = req.body;

    const alumno = alumnos.find(a => a.id == idAlumno);

    if (!alumno) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    if (!materia || nota == null) {
        return res.status(400).json({
            error: 'Faltan datos de la nota'
        });
    }
    if (nota < 0 || nota > 10) {
    return res.status(400).json({
        error: 'La nota debe estar entre 0 y 10'
    });
    }

    alumno.notas.push({
        materia,
        nota
    });

    res.status(201).json({
        mensaje: 'Nota agregada correctamente',
        alumno
    });

});

app.put('/alumnos/:id/notas', (req, res) => {

    const idAlumno = req.params.id;

    const { materia, nuevaNota } = req.body;

    const alumno = alumnos.find(a => a.id == idAlumno);

    if (!alumno) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    const notaExistente = alumno.notas.find(
        n => n.materia === materia
    );

    if (!notaExistente) {
        return res.status(404).json({
            error: 'Materia no encontrada'
        });
    }

    if (nuevaNota == null) {
        return res.status(400).json({
            error: 'Debe ingresar una nueva nota'
        });
    }

    if (nuevaNota < 0 || nuevaNota > 10) {
        return res.status(400).json({
            error: 'La nota debe estar entre 0 y 10'
        });
    }

    notaExistente.nota = nuevaNota;

    res.json({
        mensaje: 'Nota actualizada correctamente',
        alumno
    });

});