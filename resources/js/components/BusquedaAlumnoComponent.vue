<template>
    <div v-draggable>
        <div class="card text-bg-dark mb-3">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div class="p-1">BUSQUEDA DE ALUMNOS</div>
                    <div>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            aria-label="Close"
                            @click="cerrarFormularioBusquedaAlumnos"
                        ></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover" id="tblAlumnos">
                    <thead>
                        <tr>
                            <th colspan="6">
                                <input
                                    autocomplete="off"
                                    type="search"
                                    @keyup="obtenerAlumnos()"
                                    v-model="buscar"
                                    placeholder="Buscar alumno"
                                    class="form-control"
                                />
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>EMAIL</th>
                            <th>TELEFONO</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="alumno in alumnos"
                            :key="alumno.idAlumno"
                            @click="modificarAlumno(alumno)"
                        >
                            <td>{{ alumno.codigo }}</td>
                            <td>{{ alumno.nombre }}</td>
                            <td>{{ alumno.direccion }}</td>
                            <td>{{ alumno.email }}</td>
                            <td>{{ alumno.telefono }}</td>
                            <td>
                                <button
                                    class="btn btn-danger btn-sm"
                                    @click.stop="eliminarAlumno(alumno)"
                                >
                                    DEL
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import alertify from "alertifyjs";

export default {
    props: ["forms"],
    data() {
        return {
            alumnos: [],
            buscar: "",
        };
    },
    methods: {
        cerrarFormularioBusquedaAlumnos() {
            this.forms.buscar_alumnos.mostrar = false;
        },
        modificarAlumno(alumno) {
            this.$emit("modificar", alumno);
        },
        eliminarAlumno(alumno) {
            alertify.confirm(
                "¿Está seguro de eliminar el alumno?",
                async () => {
                    try {
                        await axios.delete("/api/alumno", { data: alumno });
                        await db.alumnos.delete(alumno.idAlumno);
                        this.obtenerAlumnos();
                        alertify.success("Alumno eliminado.");
                    } catch (error) {
                        alertify.error(`Error al eliminar: ${error}`);
                    }
                },
            );
        },
        async obtenerAlumnos() {
            let todos = await db.alumnos.toArray();
            if (this.buscar.length > 0) {
                const b = this.buscar.toLowerCase();
                this.alumnos = todos.filter(
                    (a) =>
                        a.codigo.toLowerCase().includes(b) ||
                        a.nombre.toLowerCase().includes(b),
                );
            } else {
                if (todos.length < 1) {
                    try {
                        const response = await axios.get("/api/alumno");
                        this.alumnos = response.data;
                        if (response.data.length > 0) {
                            await db.alumnos.bulkAdd(response.data);
                        }
                    } catch (error) {
                        alertify.error(`Error al cargar: ${error}`);
                    }
                } else {
                    this.alumnos = todos;
                }
            }
        },
    },
    created() {
        this.obtenerAlumnos();
    },
};
</script>
