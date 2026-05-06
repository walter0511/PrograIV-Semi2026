<template>
    <div v-draggable>
        <form
            id="frmDocentes"
            @submit.prevent="guardarDocente"
            @reset.prevent="limpiarFormulario"
        >
            <div class="card shadow-sm border-0" style="border-radius: 12px; overflow: hidden; min-width: 420px;">
                <div class="card-header text-white py-3" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="fw-semibold" style="font-size: 0.95rem; letter-spacing: 1px;">
                            📋 REGISTRO DE DOCENTES
                        </div>
                        <div>
                            <button
                                type="button"
                                class="btn-close btn-close-white"
                                aria-label="Close"
                                @click="cerrarFormularioDocente"
                            ></button>
                        </div>
                    </div>
                </div>
                <div class="card-body bg-white px-4 py-3">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-semibold">CÓDIGO</label>
                        <input placeholder="Ingrese código" required v-model="docente.codigo" type="text" class="form-control form-control-sm" style="border-radius: 8px;" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-semibold">NOMBRE</label>
                        <input placeholder="Ingrese nombre" required v-model="docente.nombre" type="text" class="form-control form-control-sm" style="border-radius: 8px;" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-semibold">DIRECCIÓN</label>
                        <input placeholder="Ingrese dirección" required v-model="docente.direccion" type="text" class="form-control form-control-sm" style="border-radius: 8px;" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-semibold">EMAIL</label>
                        <input placeholder="Ingrese email" required v-model="docente.email" type="email" class="form-control form-control-sm" style="border-radius: 8px;" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-semibold">TELÉFONO</label>
                        <input placeholder="Ingrese teléfono" required v-model="docente.telefono" type="text" class="form-control form-control-sm" style="border-radius: 8px;" />
                    </div>
                    <div class="mb-2">
                        <label class="form-label text-muted small fw-semibold">ESCALAFÓN</label>
                        <select required v-model="docente.escalafon" class="form-select form-select-sm" style="border-radius: 8px;">
                            <option value="">Seleccione...</option>
                            <option value="Ingeniero en sistemas">Ingeniero en sistemas</option>
                            <option value="licenciado en ingles">Licenciado en inglés</option>
                            <option value="tecnico de sistemas">Técnico de sistemas</option>
                        </select>
                    </div>
                </div>
                <div class="card-footer bg-light border-0 px-4 py-3">
                    <div class="d-flex justify-content-center gap-2">
                        <button type="submit" id="btnGuardarDocente" class="btn btn-sm text-white px-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 20px;">
                            💾 Guardar
                        </button>
                        <button type="reset" id="btnNuevoDocente" class="btn btn-sm btn-outline-secondary px-4" style="border-radius: 20px;">
                            ✨ Nuevo
                        </button>
                        <button type="button" @click="buscarDocente" id="btnBuscarDocente" class="btn btn-sm btn-outline-success px-4" style="border-radius: 20px;">
                            🔍 Buscar
                        </button>
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
            docente: {
                idDocente: uuidv4(),
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                escalafon: "",
            },
            accion: "nuevo",
        };
    },
    methods: {
        cerrarFormularioDocente() {
            this.forms.docentes.mostrar = false;
        },
        buscarDocente() {
            this.forms.buscar_docentes.mostrar = !this.forms.buscar_docentes.mostrar;
            this.$emit("buscar");
        },
        modificarDocente(docente) {
            this.accion = "modificar";
            this.docente = { ...docente };
        },
        async guardarDocente() {
            let docente = { ...this.docente };
            await db.docentes.put(docente);

            const metodo = this.accion === "modificar" ? "put" : "post";
            try {
                const response = await axios[metodo]("/api/docente", docente);
                if (response.data.msg === "ok") {
                    alertify.success("Docente guardado correctamente.");
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
            this.docente = {
                idDocente: uuidv4(),
                codigo: "",
                nombre: "",
                direccion: "",
                email: "",
                telefono: "",
                escalafon: "",
            };
            this.accion = "nuevo";
        },
    },
};
</script>
