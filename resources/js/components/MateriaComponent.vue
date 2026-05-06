<template>
    <div v-draggable>
        <form
            id="frmMaterias"
            @submit.prevent="guardarMateria"
            @reset.prevent="limpiarFormulario"
        >
            <div class="card text-bg-dark">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">REGISTRO DE MATERIAS</div>
                        <div>
                            <button
                                type="button"
                                class="btn-close btn-close-white"
                                aria-label="Close"
                                @click="cerrarFormularioMateria"
                            ></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-4">CODIGO:</div>
                        <div class="col-5">
                            <input
                                placeholder="codigo"
                                required
                                v-model="materia.codigo"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">NOMBRE:</div>
                        <div class="col-8">
                            <input
                                placeholder="nombre"
                                required
                                v-model="materia.nombre"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">UNIDADES VALORATIVAS:</div>
                        <div class="col-4">
                            <input
                                placeholder="uv"
                                required
                                v-model="materia.uv"
                                type="number"
                                min="0"
                                max="99"
                                class="form-control"
                            />
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col text-center">
                            <button type="submit" id="btnGuardarMateria" class="btn btn-primary">
                                GUARDAR
                            </button>
                            <button type="reset" id="btnNuevoMateria" class="btn btn-warning">
                                NUEVO
                            </button>
                            <button type="button" @click="buscarMateria" id="btnBuscarMateria" class="btn btn-success">
                                BUSCAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import alertify from "alertifyjs";

export default {
    props: ["forms"],
    data() {
        return {
            materia: {
                idMateria: uuidv4(),
                codigo: "",
                nombre: "",
                uv: "",
            },
            accion: "nuevo",
        };
    },
    methods: {
        cerrarFormularioMateria() {
            this.forms.materias.mostrar = false;
        },
        buscarMateria() {
            this.forms.buscar_materias.mostrar = !this.forms.buscar_materias.mostrar;
            this.$emit("buscar");
        },
        modificarMateria(materia) {
            this.accion = "modificar";
            this.materia = { ...materia };
        },
        async guardarMateria() {
            let materia = { ...this.materia };
            await db.materias.put(materia);

            const metodo = this.accion === "modificar" ? "put" : "post";
            try {
                const response = await axios[metodo]("/api/materia", materia);
                if (response.data.msg === "ok") {
                    alertify.success("Materia guardada correctamente.");
                    this.limpiarFormulario();
                } else {
                    alertify.error("Error al guardar en el servidor.");
                }
            } catch (error) {
                alertify.warning(`Guardado local OK. Sin conexión al servidor: ${error}`);
                this.limpiarFormulario();
            }
        },
        limpiarFormulario() {
            this.materia = {
                idMateria: uuidv4(),
                codigo: "",
                nombre: "",
                uv: "",
            };
            this.accion = "nuevo";
        },
    },
};
</script>
