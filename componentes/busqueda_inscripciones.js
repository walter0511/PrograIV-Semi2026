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
                let obj = await fetch('private/modulos/inscripciones/inscripcion.php?accion=consultar');
                let data = await obj.json();
                if(Array.isArray(data)){
                    // Solo sincronizar registros que tengan el ID primario (idInscripcion)
                    // para evitar el error "key path did not yield a value"
                    let validData = data.filter(item => item.idInscripcion);
                    await db.inscripciones.clear();
                    await db.inscripciones.bulkPut(validData);
                }
            } catch(e) { console.error('Error sincronizando inscripciones', e); }

            this.inscripciones = await db.inscripciones.filter(
                inscripcion =>
                    (inscripcion.nombre_alumno || '').toLowerCase().includes(this.buscar.toLowerCase()) ||
                    (inscripcion.codigo_materia || '').toLowerCase().includes(this.buscar.toLowerCase()) ||
                    (inscripcion.nombre_materia || '').toLowerCase().includes(this.buscar.toLowerCase()) ||
                    (inscripcion.estado || '').toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarInscripcion(inscripcion, e) {
            e.stopPropagation();
            alertify.confirm(
                'Eliminar inscripción',
                `¿Está seguro de eliminar la inscripción de ${inscripcion.nombre_alumno} en ${inscripcion.nombre_materia}?`,
                async () => {
                    try {
                        let obj = await fetch(`private/modulos/inscripciones/inscripcion.php?accion=eliminar&inscripciones=${encodeURIComponent(JSON.stringify(inscripcion))}`);
                        let res = await obj.json();
                        if(res.msg === 'ok' || res === true || res){
                            await db.inscripciones.delete(inscripcion.idInscripcion);
                            this.obtenerInscripciones();
                            alertify.success(`Inscripción eliminada correctamente`);
                        }
                    } catch(err) {
                        alertify.error('Error de conexión');
                    }
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