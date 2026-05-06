<template>
    <div v-draggable>
        <form
            id="frmAlumnos"
            @submit.prevent="guardarAlumno"
            @reset.prevent="limpiarFormulario"
        >
            <div class="card text-bg-dark">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="p-1">REGISTRO DE ALUMNOS</div>
                        <div>
                            <button
                                type="button"
                                class="btn-close btn-close-white"
                                aria-label="Close"
                                @click="cerrarFormularioAlumno"
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
                                v-model="alumno.codigo"
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
                                v-model="alumno.nombre"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">DIRECCION:</div>
                        <div class="col-8">
                            <input
                                placeholder="direccion"
                                required
                                v-model="alumno.direccion"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">EMAIL:</div>
                        <div class="col-8">
                            <input
                                placeholder="email"
                                required
                                v-model="alumno.email"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                    <div class="row p-1">
                        <div class="col-4">TELEFONO:</div>
                        <div class="col-6">
                            <input
                                placeholder="telefono"
                                required
                                v-model="alumno.telefono"
                                type="text"
                                class="form-control"
                            />
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col text-center">
                            <button
                                type="submit"
                                id="btnGuardarAlumno"
                                class="btn btn-primary"
                            >
                                GUARDAR
                            </button>
                            <button
                                type="reset"
                                id="btnNuevoAlumno"
                                class="btn btn-warning"
                            >
                                NUEVO
                            </button>
                            <button
                                type="button"
                                @click="buscarAlumno"
                                id="btnBuscarAlumno"
                                class="btn btn-success"
                            >
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
            alumno: {
                idAlumno: uuidv4(),
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
            },
            accion: "nuevo",
        };
    },
    methods: {
        cerrarFormularioAlumno() {
            this.forms.alumnos.mostrar = false;
        },
        buscarAlumno() {
            this.forms.buscar_alumnos.mostrar = !this.forms.buscar_alumnos.mostrar;
            this.$emit("buscar");
        },
        modificarAlumno(alumno) {
            this.accion = "modificar";
            this.alumno = { ...alumno };
        },
        async guardarAlumno() {
            let alumno = { ...this.alumno };
            // Guardar en Dexie primero (local)
            await db.alumnos.put(alumno);

            const metodo = this.accion === "modificar" ? "put" : "post";
            try {
                const response = await axios[metodo]("/api/alumno", alumno);
                if (response.data.msg === "ok") {
                    alertify.success("Alumno guardado correctamente.");
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
            this.alumno = {
                idAlumno: uuidv4(),
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
            };
            this.accion = "nuevo";
        },
    },
};
</script>
