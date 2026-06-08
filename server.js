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
    const alumnoExistente = alumnos.find(
    a => a.id == id
    );

    if (alumnoExistente) {
        return res.status(400).json({
            error: 'Ya existe un alumno con ese ID'
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

////////////////////////////////////
// Buscar alumno por ID
app.get('/alumnos/id/:id', (req, res) => {

    const alumno = alumnos.find(
        a => a.id == req.params.id
    );

    if (!alumno) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    res.json(alumno);

});

// Buscar alumno por nombre
app.get('/alumnos/nombre/:nombre', (req, res) => {

    const resultados = alumnos.filter(
        a => a.nombre.toLowerCase() === req.params.nombre.toLowerCase()
    );

    if (resultados.length === 0) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    res.json(resultados);

});

// Buscar alumno por apellido
app.get('/alumnos/apellido/:apellido', (req, res) => {

    const resultados = alumnos.filter(
        a => a.apellido.toLowerCase() === req.params.apellido.toLowerCase()
    );

    if (resultados.length === 0) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    res.json(resultados);

});

/////////////////////

app.put('/alumnos/:id', (req, res) => {

    const idAlumno = req.params.id;

    const { nombre, apellido } = req.body;

    const alumno = alumnos.find(
        a => a.id == idAlumno
    );

    if (!alumno) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    if (!nombre || !apellido) {
        return res.status(400).json({
            error: 'Debe ingresar nombre y apellido'
        });
    }

    alumno.nombre = nombre;
    alumno.apellido = apellido;

    res.json({
        mensaje: 'Datos actualizados correctamente',
        alumno
    });

});

app.delete('/alumnos/:id', (req, res) => {

    const idAlumno = req.params.id;

    const { confirmar } = req.body;

    const indiceAlumno = alumnos.findIndex(
        a => a.id == idAlumno
    );

    if (indiceAlumno === -1) {
        return res.status(404).json({
            error: 'Alumno no encontrado'
        });
    }

    if (confirmar !== true) {
        return res.status(400).json({
            error: 'Debe confirmar la eliminación'
        });
    }

    alumnos.splice(indiceAlumno, 1);

    res.json({
        mensaje: 'Alumno eliminado correctamente'
    });

});



// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});