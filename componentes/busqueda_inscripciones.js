const busqueda_inscripciones = {
    props: ['forms'],
    data() {
        return {
            buscar: '',
            inscripciones: []
        }
    },
    methods: {
        modificarInscripcion(inscripcion) {
            this.$emit('modificar', inscripcion);
        },
        async obtenerInscripciones() {
            try {
                let resp = await fetch('private/modulos/inscripciones/inscripcion.php?accion=consultar');
                let text = await resp.text();

                if (!text.trim().startsWith('<?php') && !text.trim().startsWith('<')) {
                    let data = JSON.parse(text);
                    if(Array.isArray(data)){
                        // Solo sincronizar registros que tengan el ID primario
                        let validData = data.filter(item => item.idInscripcion);
                        await db.exec("DELETE FROM inscripciones");
                        for (const i of validData) {
                            await db.exec(`
                                INSERT OR REPLACE INTO inscripciones (
                                    idInscripcion, codigo_alumno, nombre_alumno, codigo_materia, nombre_materia, uv, fecha_inscripcion, estado, observaciones, hash
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `, [i.idInscripcion, i.codigo_alumno, i.nombre_alumno, i.codigo_materia, i.nombre_materia, i.uv, i.fecha_inscripcion, i.estado, i.observaciones, i.hash]);
                        }
                    }
                }
            } catch(e) { 
                // Silenced: local mode fallback
            }

            let buscar = `%${this.buscar}%`;
            this.inscripciones = await db.query(`
                SELECT * FROM inscripciones 
                WHERE nombre_alumno LIKE ? 
                   OR codigo_materia LIKE ? 
                   OR nombre_materia LIKE ? 
                   OR estado LIKE ?
            `, [buscar, buscar, buscar, buscar]);
        },
        async eliminarInscripcion(inscripcion, e) {
            e.stopPropagation();
            alertify.confirm(
                'Eliminar inscripción',
                `¿Está seguro de eliminar la inscripción de ${inscripcion.nombre_alumno} en ${inscripcion.nombre_materia}?`,
                async () => {
                    // Eliminar localmente (SQLite)
                    await db.exec("DELETE FROM inscripciones WHERE idInscripcion = ?", [inscripcion.idInscripcion]);
                    this.obtenerInscripciones();
                    alertify.success(`Inscripción eliminada correctamente`);

                    // Sincronizar con servidor (silencioso)
                    fetch(`private/modulos/inscripciones/inscripcion.php?accion=eliminar&inscripciones=${encodeURIComponent(JSON.stringify(inscripcion))}`)
                        .then(res => res.text())
                        .then(text => {
                            if (!text.trim().startsWith('<')) {
                                let resp = JSON.parse(text);
                                if (resp.msg !== 'ok' && resp !== true) console.warn("Aviso servidor:", resp);
                            }
                        })
                        .catch(() => {});
                },
                () => {}
            );
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-journal-check me-2"></i>REPORTE DE INSCRIPCIONES</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerInscripciones()" v-model="buscar" placeholder="🔍 Buscar por alumno, materia o estado..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ALUMNO</th>
                                    <th>MATERIA</th>
                                    <th>FECHA</th>
                                    <th>ESTADO</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion" @click="modificarInscripcion(inscripcion)">
                                    <td class="fw-bold">{{ inscripcion.nombre_alumno }}</td>
                                    <td>
                                        <div class="small fw-bold text-accent">{{ inscripcion.codigo_materia }}</div>
                                        <div class="small text-secondary">{{ inscripcion.nombre_materia }}</div>
                                    </td>
                                    <td>{{ inscripcion.fecha_inscripcion }}</td>
                                    <td>
                                        <span :class="['badge rounded-pill', 
                                            inscripcion.estado === 'inscrito' ? 'bg-primary' : 
                                            inscripcion.estado === 'aprobado' ? 'bg-success' : 'bg-danger']">
                                            {{ inscripcion.estado }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarInscripcion(inscripcion, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="inscripciones.length == 0">
                                    <td colspan="6" class="text-center py-5 text-secondary">
                                        No se encontraron inscripciones con los criterios de búsqueda
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};