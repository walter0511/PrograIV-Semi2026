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
        // Se omite la carga inicial para evitar el error "DB no inicializada".
        // La carga ocurre de forma segura cuando el usuario abre la pestaña (ver 'watch' abajo).
    },

    watch: {
        'forms.inscripciones.mostrar'(newVal) {
            if (newVal) {
                this.cargarMaterias();
                this.cargarAlumnos();
            }
        }
    },

    methods: {

        async cargarMaterias() {
            try {
                this.materias = await db.query("SELECT * FROM materias ORDER BY codigo");
            } catch (e) {
                // Silenced: la DB podría no estar lista aún
            }
        },

        async cargarAlumnos() {
            try {
                this.alumnos = await db.query("SELECT * FROM alumnos ORDER BY codigo");
            } catch (e) {
                // Silenced
            }
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

                let alumnoResult = await db.query("SELECT * FROM alumnos WHERE codigo = ?", [this.inscripcion.codigo_alumno]);
                let alumno = alumnoResult.length > 0 ? alumnoResult[0] : null;

                if (alumno) {
                    this.inscripcion.nombre_alumno = alumno.nombre;
                } else {
                    this.inscripcion.nombre_alumno = 'No asignado';
                }

                // Verificar duplicado
                let duplicado = await db.query(
                    "SELECT * FROM inscripciones WHERE codigo_alumno = ? AND codigo_materia = ?",
                    [this.inscripcion.codigo_alumno, this.inscripcion.codigo_materia]
                );

                if (duplicado.length > 0 && this.accion === 'nuevo') {
                    alertify.error('Esta materia ya fue inscrita para este alumno');
                    return;
                }

                let inscritas = await db.query(
                    "SELECT uv FROM inscripciones WHERE codigo_alumno = ?",
                    [this.inscripcion.codigo_alumno]
                );

                let totalUV = inscritas.reduce(
                    (acc, item) => acc + (parseInt(item.uv) || 0),
                    0
                );

                let currentUV = parseInt(this.inscripcion.uv) || 0;
                totalUV += currentUV;

                if (totalUV > 20) {
                    alertify.warning('Alerta: Límite de UV excedido, pero se guardará.');
                }

                // Asegurar que el ID primario SIEMPRE tenga valor
                if (this.accion === 'modificar' && this.idInscripcion) {
                    this.inscripcion.idInscripcion = this.idInscripcion.toString();
                } else {
                    this.inscripcion.idInscripcion = this.getId().toString();
                }

                // Obtener datos puros
                let rawData = JSON.parse(JSON.stringify(this.inscripcion));
                rawData.uv = currentUV;
                rawData.hash = sha256(JSON.stringify(rawData));

                // Guardar en SQLite
                await db.exec(`
                    INSERT OR REPLACE INTO inscripciones (
                        idInscripcion, codigo_alumno, nombre_alumno, codigo_materia, nombre_materia, uv, fecha_inscripcion, estado, observaciones, hash
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [rawData.idInscripcion, rawData.codigo_alumno, rawData.nombre_alumno, rawData.codigo_materia, rawData.nombre_materia, rawData.uv, rawData.fecha_inscripcion, rawData.estado, rawData.observaciones, rawData.hash]);


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
        <div class="row">
            <div class="col-8">
                <form id="frmInscripciones" @submit.prevent="guardarInscripcion" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 48rem;">
                        <div class="card-header">INSCRIPCIÓN DE ASIGNATURAS</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">
                                    ALUMNO:
                                </div>
                                <div class="col-9">
                                    <select v-model="inscripcion.codigo_alumno" class="form-select" :disabled="alumnos.length === 0" required>
                                        <option value="">-- Elija un alumno --</option>
                                        <option v-for="a in alumnos" :key="a.idAlumno" :value="a.codigo">
                                            {{ a.codigo }} - {{ a.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    ASIGNATURA:
                                </div>
                                <div class="col-9">
                                    <select v-model="inscripcion.codigo_materia"
                                            @change="seleccionarMateria"
                                            class="form-select"
                                            :disabled="materias.length === 0" required>
                                        <option value="">-- Elija una materia --</option>
                                        <option v-for="m in materias"
                                                :key="m.idMateria"
                                                :value="m.codigo">
                                            {{ m.codigo }} - {{ m.nombre }} ({{ m.uv }} UV)
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    FECHA:
                                </div>
                                <div class="col-4">
                                    <input v-model="inscripcion.fecha_inscripcion" type="date" class="form-control" required>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    ESTADO:
                                </div>
                                <div class="col-4">
                                    <select v-model="inscripcion.estado" class="form-select" required>
                                        <option value="inscrito">Inscrito</option>
                                        <option value="retirado">Retirado</option>
                                        <option value="aprobado">Aprobado</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    OBSERVACIONES:
                                </div>
                                <div class="col-9">
                                    <textarea v-model="inscripcion.observaciones" class="form-control" rows="2" placeholder="Detalles..."></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarInscripcion" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarInscripcion" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarInscripcion" id="btnBuscarInscripcion" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};