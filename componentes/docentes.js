const docentes = {
    props:['forms'],
    data(){
        return{
            docente:{
                idDocente:0,
                codigo:"",
                nombre:"",
                direccion:"",
                email:"",
                telefono:"",
                escalafon:""
            },
            accion:'nuevo',
            idDocente:0,
            data_docentes:[]
        }
    },
    methods:{
        buscarDocente(){
            this.forms.busqueda_docentes.mostrar = !this.forms.busqueda_docentes.mostrar;
            this.$emit('buscar');
        },
        modificarDocente(docente){
            this.accion = 'modificar';
            this.idDocente = docente.idDocente;
            this.docente.codigo = docente.codigo;
            this.docente.nombre = docente.nombre;
            this.docente.direccion = docente.direccion;
            this.docente.email = docente.email;
            this.docente.telefono = docente.telefono;
            this.docente.escalafon = docente.escalafon;
        },
        async guardarDocente() {
            let datos = {
                idDocente: this.accion=='modificar' ? this.idDocente : this.getId(),
                codigo: this.docente.codigo,
                nombre: this.docente.nombre,
                direccion: this.docente.direccion,
                email: this.docente.email,
                telefono: this.docente.telefono,
                escalafon: this.docente.escalafon
            };
            this.buscar = datos.codigo;
            //await this.obtenerDocentes();

            if(this.data_docentes.length > 0 && this.accion=='nuevo'){
                alertify.error(`El codigo del docente ya existe, ${this.data_docentes[0].nombre}`);
                return; //Termina la ejecucion de la funcion
            }
            db.docentes.put(datos);
            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
            //this.obtenerDocentes();
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idDocente = 0;
            this.docente.codigo = '';
            this.docente.nombre = '';
            this.docente.direccion = '';
            this.docente.email = '';
            this.docente.telefono = '';
            this.docente.escalafon = '';
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-10">
                <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario" class="glass-card">
                    <div class="card-header">
                        <i class="bi bi-person-workspace me-2"></i>REGISTRO DE DOCENTES
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">CÓDIGO</label>
                            <input placeholder="DOC-001" required v-model="docente.codigo" type="text" class="form-control">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label text-secondary small fw-bold">NOMBRE DEL DOCENTE</label>
                            <input placeholder="Nombre completo" required v-model="docente.nombre" type="text" class="form-control">
                        </div>
                        
                        <div class="col-12">
                            <label class="form-label text-secondary small fw-bold">DIRECCIÓN</label>
                            <input placeholder="Dirección de contacto" required v-model="docente.direccion" type="text" class="form-control">
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label text-secondary small fw-bold">EMAIL</label>
                            <input placeholder="correo@institucion.edu" required v-model="docente.email" type="email" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-secondary small fw-bold">TELÉFONO</label>
                            <input placeholder="0000-0000" required v-model="docente.telefono" type="text" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-secondary small fw-bold">ESCALAFÓN</label>
                            <select required v-model="docente.escalafon" class="form-select fw-semibold">
                                <option value="" disabled>Seleccione...</option>
                                <option value="tecnico">Técnico</option>
                                <option value="profesor">Profesor</option>
                                <option value="ingeniero">Licenciado/Ingeniero</option>
                                <option value="maestria">Maestría</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-5 d-flex gap-2 justify-content-center">
                        <button type="submit" class="btn btn-primary px-5">
                            <i class="bi bi-save me-2"></i>GUARDAR
                        </button>
                        <button type="reset" class="btn btn-warning px-4">
                             <i class="bi bi-plus-circle me-2"></i>NUEVO
                        </button>
                        <button type="button" @click="buscarDocente" class="btn btn-success px-4">
                            <i class="bi bi-search me-2"></i>BUSCAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
};