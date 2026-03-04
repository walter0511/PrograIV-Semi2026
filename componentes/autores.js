const autores = {
    props: ['forms'],
    data(){
        return{
            autor:{
                idAutor:0,
                codigo:"",
                nombre:"",
                pais:"",
                telefono:""
            },
            accion:'nuevo',
            data_autores_:[]
        }
    },
    methods:{
        buscarAutores(){
            this.forms.busqueda_autores.mostrar = !this.forms.busqueda_autores.mostrar;
            this.$emit('buscar');
        },
        modificarAutor(autor){ 
            this.accion = 'modificar';
            this.idAutor = autor.idAutor;
            this.autor.codigo = autor.codigo;
            this.autor.nombre = autor.nombre;
            this.autor.pais = autor.pais;
            this.autor.telefono = autor.telefono;
        },
        async guardarAutor() {
            let datos = {
                idAutor: this.accion=='modificar' ? this.idAutor : this.getId(),
                codigo: this.autor.codigo,
                nombre: this.autor.nombre,
                pais: this.autor.pais,
                telefono: this.autor.telefono
            };
            await db.autores.put(datos);
            this.limpiarFormulario();
            alertify.success(`Autor ${datos.nombre} guardado correctamente`);
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idAutor = 0;
            this.autor.codigo = '';
            this.autor.nombre = '';
            this.autor.pais = '';
            this.autor.telefono = '';
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-10">
                <div class="card shadow border-0">
                    <div class="card-header bg-primary text-white py-3">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-person-plus me-2"></i>REGISTRO DE AUTOR
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <form id="frmAutores" @submit.prevent="guardarAutor" @reset.prevent="limpiarFormulario">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label fw-bold">CÓDIGO</label>
                                    <input placeholder="Ej: AUT001" required v-model="autor.codigo" type="text" class="form-control">
                                </div>
                                <div class="col-md-8">
                                    <label class="form-label fw-bold">NOMBRE COMPLETO</label>
                                    <input placeholder="Nombre del autor" required v-model="autor.nombre" type="text" class="form-control">
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">PAÍS</label>
                                    <input placeholder="País de origen" required v-model="autor.pais" type="text" class="form-control">
                                </div>
                                
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">TELÉFONO (8 dígitos)</label>
                                    <input placeholder="00000000" required v-model="autor.telefono" type="text" maxlength="8" pattern="[0-9]{8}" class="form-control" title="Debe ingresar exactamente 8 dígitos">
                                </div>
                            </div>

                            <div class="mt-5 d-flex gap-2 justify-content-end">
                                <button type="reset" class="btn btn-outline-light px-4">
                                    <i class="bi bi-plus-circle me-2"></i>NUEVO
                                </button>
                                <button type="button" @click="buscarAutores" class="btn btn-outline-success px-4">
                                    <i class="bi bi-search me-2"></i>BUSCAR
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-save me-2"></i>GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};