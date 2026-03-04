const inscripciones = {
    props: ['forms'],

    data() {
        return {
            inscripcion: {
                idInscripcion: '',
                codigo_alumno: '',
                nombre_alumno: '',
                codigo_materia: '',
                nombre_materia: '',
                uv: 0,
                fecha_inscripcion: '',
                ciclo_periodo: '',
                estado: 'inscrito',
                observaciones: '',
                hash: ''
            },
            materias: [],
            accion: 'nuevo',
            idInscripcion: '',
        }
    },

    mounted() {
        this.cargarMaterias();
    },

    methods: {

        async cargarMaterias() {
            this.materias = await db.materias.toArray();
        },

        buscarInscripcion() {
            this.forms.busqueda_inscripciones.mostrar =
                !this.forms.busqueda_inscripciones.mostrar;
            this.$emit('buscar');
        },

        modificarInscripcion(inscripcion) {
            this.accion = 'modificar';
            this.idInscripcion = inscripcion.idInscripcion;
            Object.assign(this.inscripcion, inscripcion);
        },

        limpiarFormulario() {
            this.accion = 'nuevo';
            this.idInscripcion = '';
            this.inscripcion = {
                idInscripcion: '',
                codigo_alumno: '',
                nombre_alumno: '',
                codigo_materia: '',
                nombre_materia: '',
                uv: 0,
                fecha_inscripcion: '',
                ciclo_periodo: '',
                estado: 'inscrito',
                observaciones: '',
                hash: ''
            };
        },

        seleccionarMateria() {
            let materia = this.materias.find(
                m => String(m.codigo) === String(this.inscripcion.codigo_materia)
            );

            if (materia) {
                this.inscripcion.nombre_materia = materia.nombre;
                this.inscripcion.uv = parseInt(materia.uv);
            } else {
                this.inscripcion.nombre_materia = '';
                this.inscripcion.uv = 0;
            }
        },

        async guardarInscripcion() {

            if (!this.inscripcion.codigo_alumno ||
                !this.inscripcion.codigo_materia ||
                !this.inscripcion.fecha_inscripcion ||
                !this.inscripcion.ciclo_periodo) {

                alertify.error('Complete todos los campos obligatorios');
                return;
            }

            
            let matricula = await db.matriculas
    .where("codigo_alumno")
    .equals(this.inscripcion.codigo_alumno)
    .and(m => m.ciclo_periodo === this.inscripcion.ciclo_periodo)
    .first();

if (!matricula) {
    alertify.error('El alumno no está matriculado en este ciclo');
    return;
}

let alumno = await db.alumnos
    .where("codigo")
    .equals(this.inscripcion.codigo_alumno)
    .first();

if (alumno) {
    this.inscripcion.nombre_alumno = alumno.nombre;
} else {
    this.inscripcion.nombre_alumno = '';
}
            let duplicado = await db.inscripciones
                .filter(i =>
                    i.codigo_alumno === this.inscripcion.codigo_alumno &&
                    i.codigo_materia === this.inscripcion.codigo_materia &&
                    i.ciclo_periodo === this.inscripcion.ciclo_periodo
                ).toArray();

            if (duplicado.length > 0 && this.accion === 'nuevo') {
                alertify.error('Esta materia ya fue inscrita en este ciclo');
                return;
            }

            let inscritas = await db.inscripciones
                .filter(i =>
                    i.codigo_alumno === this.inscripcion.codigo_alumno &&
                    i.ciclo_periodo === this.inscripcion.ciclo_periodo
                ).toArray();

            let totalUV = inscritas.reduce(
                (acc, item) => acc + parseInt(item.uv || 0),
                0
            );

            totalUV += parseInt(this.inscripcion.uv);

            if (totalUV > 20) {
                alertify.error('No puede inscribir más de 20 UV por ciclo');
                return;
            }

            let datos = { ...this.inscripcion };

if (this.accion === 'modificar') {
    datos.idInscripcion = this.idInscripcion;
} else {
    delete datos.idInscripcion; 
}

            datos.hash = sha256(JSON.stringify(datos));

            await db.inscripciones.put(datos);

            this.limpiarFormulario();
            alertify.success('Materia inscrita correctamente');
        },

        getId() {
            return new Date().getTime();
        }
    },

   


    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-10">
                <div class="glass-card">
                    <div class="card-header">
                        <i class="bi bi-pencil-square me-2"></i>INSCRIPCIÓN DE ASIGNATURAS
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">CÓDIGO ALUMNO</label>
                            <input placeholder="Busque el alumno..." v-model="inscripcion.codigo_alumno" type="text" class="form-control">
                        </div>
                        
                        <div class="col-md-8">
                            <label class="form-label text-secondary small fw-bold">SELECCIONAR ASIGNATURA</label>
                            <select v-model="inscripcion.codigo_materia"
                                    @change="seleccionarMateria"
                                    class="form-select"
                                    :disabled="materias.length === 0">
                                <option value="">-- Elija una materia --</option>
                                <option v-for="m in materias"
                                        :key="m.idMateria"
                                        :value="m.codigo">
                                    {{ m.codigo }} - {{ m.nombre }} ({{ m.uv }} UV)
                                </option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">FECHA DE INSCRIPCIÓN</label>
                            <input v-model="inscripcion.fecha_inscripcion" type="date" class="form-control">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">CICLO / PERIODO</label>
                            <select v-model="inscripcion.ciclo_periodo" class="form-select">
                                <option value="" disabled>Seleccione ciclo...</option>
                                <option value="Ciclo 1-2026">Ciclo 1-2026</option>
                                <option value="Ciclo 2-2026">Ciclo 2-2026</option>
                            </select>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">ESTADO INICIAL</label>
                            <select v-model="inscripcion.estado" class="form-select">
                                <option value="inscrito">Inscrito</option>
                                <option value="retirado">Retirado</option>
                                <option value="aprobado">Aprobado</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="form-label text-secondary small fw-bold">OBSERVACIONES ADICIONALES</label>
                            <textarea v-model="inscripcion.observaciones" class="form-control" rows="2" placeholder="Escriba aquí cualquier detalle relevante..."></textarea>
                        </div>
                    </div>

                    <div class="mt-5 d-flex gap-2 justify-content-center">
                        <button type="button" @click="guardarInscripcion" class="btn btn-primary px-5">
                            <i class="bi bi-save me-2"></i>GUARDAR INSCRIPCIÓN
                        </button>
                        <button type="button" @click="limpiarFormulario" class="btn btn-warning px-4">
                            <i class="bi bi-plus-circle me-2"></i>NUEVO
                        </button>
                        <button type="button" @click="buscarInscripcion" class="btn btn-success px-4">
                            <i class="bi bi-search me-2"></i>BUSCAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};