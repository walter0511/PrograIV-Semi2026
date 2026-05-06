<template>
    <div v-draggable>
        <div class="card text-bg-dark mb-3">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div class="p-1">BUSQUEDA DE MATERIAS</div>
                    <div>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            aria-label="Close"
                            @click="cerrarFormularioBusquedaMaterias"
                        ></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover" id="tblMaterias">
                    <thead>
                        <tr>
                            <th colspan="4">
                                <input
                                    autocomplete="off"
                                    type="search"
                                    @keyup="obtenerMaterias()"
                                    v-model="buscar"
                                    placeholder="Buscar materia"
                                    class="form-control"
                                />
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>UV</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="materia in materias"
                            :key="materia.idMateria"
                            @click="modificarMateria(materia)"
                        >
                            <td>{{ materia.codigo }}</td>
                            <td>{{ materia.nombre }}</td>
                            <td>{{ materia.uv }}</td>
                            <td>
                                <button
                                    class="btn btn-danger btn-sm"
                                    @click.stop="eliminarMateria(materia)"
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
            materias: [],
            buscar: "",
        };
    },
    methods: {
        cerrarFormularioBusquedaMaterias() {
            this.forms.buscar_materias.mostrar = false;
        },
        modificarMateria(materia) {
            this.$emit("modificar", materia);
        },
        eliminarMateria(materia) {
            alertify.confirm(
                "¿Está seguro de eliminar la materia?",
                async () => {
                    try {
                        await axios.delete("/api/materia", { data: materia });
                        await db.materias.delete(materia.idMateria);
                        this.obtenerMaterias();
                        alertify.success("Materia eliminada.");
                    } catch (error) {
                        alertify.error(`Error al eliminar: ${error}`);
                    }
                },
            );
        },
        async obtenerMaterias() {
            let todos = await db.materias.toArray();
            if (this.buscar.length > 0) {
                const b = this.buscar.toLowerCase();
                this.materias = todos.filter(
                    (m) =>
                        m.codigo.toLowerCase().includes(b) ||
                        m.nombre.toLowerCase().includes(b),
                );
            } else {
                if (todos.length < 1) {
                    try {
                        const response = await axios.get("/api/materia");
                        this.materias = response.data;
                        if (response.data.length > 0) {
                            await db.materias.bulkAdd(response.data);
                        }
                    } catch (error) {
                        alertify.error(`Error al cargar: ${error}`);
                    }
                } else {
                    this.materias = todos;
                }
            }
        },
    },
    created() {
        this.obtenerMaterias();
    },
};
</script>
