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
                estado: 'inscrito',
                observaciones: '',
                hash: ''
            },
            materias: [],
            alumnos: [],
            accion: 'nuevo',
            idInscripcion: '',
        }
    },

    mounted() {
        this.cargarMaterias();
        this.cargarAlumnos();
    },

    methods: {

        async cargarMaterias() {
            this.materias = await db.materias.toArray();
        },

        async cargarAlumnos() {
            this.alumnos = await db.alumnos.toArray();
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
            try {
                if (!this.inscripcion.codigo_alumno ||
                    !this.inscripcion.codigo_materia ||
                    !this.inscripcion.fecha_inscripcion) {

                    alertify.error('Complete todos los campos obligatorios');
                    return;
                }

                let alumno = await db.alumnos
                    .where("codigo")
                    .equals(this.inscripcion.codigo_alumno)
                    .first();

                if (alumno) {
                    this.inscripcion.nombre_alumno = alumno.nombre;
                } else {
                    this.inscripcion.nombre_alumno = 'No asignado';
                }

                let duplicado = await db.inscripciones
                    .filter(i =>
                        i.codigo_alumno === this.inscripcion.codigo_alumno &&
                        i.codigo_materia === this.inscripcion.codigo_materia
                    ).toArray();

                if (duplicado.length > 0 && this.accion === 'nuevo') {
                    alertify.error('Esta materia ya fue inscrita para este alumno');
                    return;
                }

                let inscritas = await db.inscripciones
                    .filter(i =>
                        i.codigo_alumno === this.inscripcion.codigo_alumno
                    ).toArray();

                let totalUV = inscritas.reduce(
                    (acc, item) => acc + (parseInt(item.uv) || 0),
                    0
                );

                let currentUV = parseInt(this.inscripcion.uv) || 0;
                totalUV += currentUV;

                if (totalUV > 20) {
                    alertify.warning('Alerta: Límite de UV excedido, pero se guardará.');
                }

                // Asegurar que el ID primario SIEMPRE tenga valor en el objeto original
                if (this.accion === 'modificar' && this.idInscripcion) {
                    this.inscripcion.idInscripcion = this.idInscripcion.toString();
                } else {
                    this.inscripcion.idInscripcion = this.getId().toString();
                }

                // Obtener datos puros para la base de datos
                let rawData = JSON.parse(JSON.stringify(this.inscripcion));
                rawData.uv = currentUV;
                rawData.hash = sha256(JSON.stringify(rawData));

                // Guardar en Dexie con el objeto procesado
                console.log("Guardando en Dexie:", rawData);
                await db.inscripciones.put(rawData);

                // Sincronizar con servidor usando el objeto ya guardado
                fetch(`private/modulos/inscripciones/inscripcion.php?accion=${this.accion}&inscripciones=${encodeURIComponent(JSON.stringify(rawData))}`)
                    .then(response => response.json())
                    .then(data => {
                        if(data != true && data?.msg !== 'ok') {
                            console.warn(`Error al sincronizar: ${data?.msg || 'Datos inválidos'}`);
                        }
                    })
                    .catch(() => {});

                this.limpiarFormulario();
                alertify.success('Materia inscrita correctamente');
            } catch (err) {
                console.error("Error al guardar inscripción:", err);
                alertify.error("Lo sentimos, ocurrió un error interno");
            }
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
                            <select v-model="inscripcion.codigo_alumno" class="form-select" :disabled="alumnos.length === 0">
                                <option value="">-- Elija un alumno --</option>
                                <option v-for="a in alumnos" :key="a.idAlumno" :value="a.codigo">
                                    {{ a.codigo }} - {{ a.nombre }}
                                </option>
                            </select>
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

                        <div class="col-md-6">
                            <label class="form-label text-secondary small fw-bold">FECHA DE INSCRIPCIÓN</label>
                            <input v-model="inscripcion.fecha_inscripcion" type="date" class="form-control">
                        </div>

                        <div class="col-md-6">
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