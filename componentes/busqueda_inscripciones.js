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
            this.inscripciones = await db.inscripciones.filter(
                inscripcion =>
                    inscripcion.nombre_alumno.toLowerCase().includes(this.buscar.toLowerCase()) ||
                    inscripcion.codigo_materia.toLowerCase().includes(this.buscar.toLowerCase()) ||
                    inscripcion.nombre_materia.toLowerCase().includes(this.buscar.toLowerCase()) ||
                    inscripcion.ciclo_periodo.toLowerCase().includes(this.buscar.toLowerCase()) ||
                    inscripcion.estado.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarInscripcion(inscripcion, e) {
            e.stopPropagation();
            alertify.confirm(
                'Eliminar inscripción',
                `¿Está seguro de eliminar la inscripción de ${inscripcion.nombre_alumno} en ${inscripcion.nombre_materia}?`,
                async () => {
                    await db.inscripciones.delete(inscripcion.idInscripcion);
                    this.obtenerInscripciones();
                    alertify.success(`Inscripción eliminada correctamente`);
                },
                () => {}
            );
        },
    },
    template: `
        <div>
            <div class="row mb-2">
                <th colspan="6">
                     <input autocomplete="off" type="search" @keyup="obtenerInscripciones()" v-model="buscar" placeholder="Buscar inscripción" class="form-control">
                     </th>
            </div>

            <div class="row">
                <div class="col-12">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ALUMNO</th>
                                <th>CÓDIGO</th>
                                <th>MATERIA</th>
                                <th>CICLO</th>
                                <th>FECHA</th>
                                <th>ESTADO</th>
                                <th>HASH</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="inscripcion in inscripciones"
                                :key="inscripcion.idInscripcion"
                                @click="modificarInscripcion(inscripcion)">

                                <td>{{ inscripcion.nombre_alumno }}</td>
                                <td>{{ inscripcion.codigo_materia }}</td>
                                <td>{{ inscripcion.nombre_materia }}</td>
                                <td>{{ inscripcion.ciclo_periodo }}</td>
                                <td>{{ inscripcion.fecha_inscripcion }}</td>
                                <td>{{ inscripcion.estado }}</td>
                                <td>{{ inscripcion.hash }}</td>

                                <td>
                                    <button class="btn btn-danger btn-sm"
                                        @click.stop="eliminarInscripcion(inscripcion, $event)">
                                        DEL
                                    </button>
                                </td>

                            </tr>
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    `
};