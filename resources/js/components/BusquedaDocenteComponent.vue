<template>
    <div v-draggable>
        <div class="card text-bg-dark mb-3">
            <div class="card-header">
                <div class="d-flex justify-content-between">
                    <div class="p-1">BUSQUEDA DE DOCENTES</div>
                    <div>
                        <button
                            type="button"
                            class="btn-close btn-close-white"
                            aria-label="Close"
                            @click="cerrarFormularioBusquedaDocentes"
                        ></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover" id="tblDocentes">
                    <thead>
                        <tr>
                            <th colspan="7">
                                <input
                                    autocomplete="off"
                                    type="search"
                                    @keyup="obtenerDocentes()"
                                    v-model="buscar"
                                    placeholder="Buscar docente"
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
                            <th>ESCALAFON</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="docente in docentes"
                            :key="docente.idDocente"
                            @click="modificarDocente(docente)"
                        >
                            <td>{{ docente.codigo }}</td>
                            <td>{{ docente.nombre }}</td>
                            <td>{{ docente.direccion }}</td>
                            <td>{{ docente.email }}</td>
                            <td>{{ docente.telefono }}</td>
                            <td>{{ docente.escalafon }}</td>
                            <td>
                                <button
                                    class="btn btn-danger btn-sm"
                                    @click.stop="eliminarDocente(docente)"
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
            docentes: [],
            buscar: "",
        };
    },
    methods: {
        cerrarFormularioBusquedaDocentes() {
            this.forms.buscar_docentes.mostrar = false;
        },
        modificarDocente(docente) {
            this.$emit("modificar", docente);
        },
        eliminarDocente(docente) {
            alertify.confirm(
                "¿Está seguro de eliminar el docente?",
                async () => {
                    try {
                        await axios.delete("/api/docente", { data: docente });
                        await db.docentes.delete(docente.idDocente);
                        this.obtenerDocentes();
                        alertify.success("Docente eliminado.");
                    } catch (error) {
                        alertify.error(`Error al eliminar: ${error}`);
                    }
                },
            );
        },
        async obtenerDocentes() {
            let todos = await db.docentes.toArray();
            if (this.buscar.length > 0) {
                const b = this.buscar.toLowerCase();
                this.docentes = todos.filter(
                    (d) =>
                        d.codigo.toLowerCase().includes(b) ||
                        d.nombre.toLowerCase().includes(b),
                );
            } else {
                if (todos.length < 1) {
                    try {
                        const response = await axios.get("/api/docente");
                        this.docentes = response.data;
                        if (response.data.length > 0) {
                            await db.docentes.bulkAdd(response.data);
                        }
                    } catch (error) {
                        alertify.error(`Error al cargar: ${error}`);
                    }
                } else {
                    this.docentes = todos;
                }
            }
        },
    },
    created() {
        this.obtenerDocentes();
    },
};
</script>
