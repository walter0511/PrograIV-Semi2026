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
        <div class="row">
            <div class="col-8">
                <div class="card text-bg-secondary mb-3">
                    <div class="card-header">INSCRIPCIÓN DE MATERIAS</div>
                    <div class="card-body">

                        <div class="row p-1">
                            <div class="col-3">CÓDIGO ALUMNO: </div>
                            <div class="col-4">
                                <input v-model="inscripcion.codigo_alumno" type="text" class="form-control">
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col-3">MATERIA: </div>
                            <div class="col-6">
                                <select v-model="inscripcion.codigo_materia"
                                        @change="seleccionarMateria"
                                        class="form-control"
                                        :disabled="materias.length === 0">
                                    <option value="">-- Seleccione Materia --</option>
                                    <option v-for="m in materias"
                                            :key="m.idMateria"
                                            :value="m.codigo">
                                        {{ m.codigo }} - {{ m.nombre }} ({{ m.uv }} UV)
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col-3">FECHA INSCRIPCIÓN: </div>
                            <div class="col-4">
                                <input v-model="inscripcion.fecha_inscripcion" type="date" class="form-control">
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col-3">Ciclo/Periodo:</div>
                            <div class="col-4">
                                <select v-model="inscripcion.ciclo_periodo" class="form-control">
                                <option value="" disabled>Seleccione ciclo</option>
                                    <option value="Ciclo 1-2026">Ciclo 1-2026</option>
                                    <option value="Ciclo 2-2026">Ciclo 2-2026</option>
                                </select>
                            </div>

                        <div class="row p-1">
                            <div class="col-3">ESTADO:</div>
                            <div class="col-4">
                                <select v-model="inscripcion.estado" class="form-control">
                                    <option value="inscrito">Inscrito</option>
                                    <option value="retirado">Retirado</option>
                                    <option value="aprobado">Aprobado</option>
                                </select>
                            </div>
                        </div>

                        <div class="row p-1">
                            <div class="col-3">OBSERVACIONES:</div>
                            <div class="col-8">
                                <textarea v-model="inscripcion.observaciones" class="form-control" rows="2"></textarea>
                            </div>
                        </div>

                        <div class="row p-1 mt-2">
                            <div class="col text-center">
                                <button type="button" @click="guardarInscripcion" class="btn btn-primary">GUARDAR</button>
                                <button type="button" @click="limpiarFormulario" class="btn btn-warning ms-2">NUEVO</button>
                                <button type="button" @click="buscarInscripcion" class="btn btn-success ms-2">BUSCAR</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `
};