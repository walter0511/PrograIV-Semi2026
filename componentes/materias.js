const materias = {
    props:['forms'],
    data(){
        return{
            materia:{
                idMateria:0,
                codigo:"",
                nombre:"",
                uv:'',
            },
            accion:'nuevo',
            idMateria:0,
            data_materias:[]
        }
    },
    methods:{
        buscarMateria(){
            this.forms.busqueda_materias.mostrar = !this.forms.busqueda_materias.mostrar;
            this.$emit('buscar');
        },
        modificarMateria(materia){
            this.accion = 'modificar';
            this.idMateria = materia.idMateria;
            this.materia.codigo = materia.codigo;
            this.materia.nombre = materia.nombre;
            this.materia.uv = materia.uv;
        },
        async guardarMateria() {
            let datos = {
                idMateria: this.accion=='modificar' ? this.idMateria : this.getId(),
                codigo: this.materia.codigo,
                nombre: this.materia.nombre,
                uv: this.materia.uv,
            };
            this.buscar = datos.codigo;
            //await this.obtenerMaterias();

            if(this.data_materias.length > 0 && this.accion=='nuevo'){
                alertify.error(`El codigo del materia ya existe, ${this.data_materias[0].nombre}`);
                return; //Termina la ejecucion de la funcion
            }
            db.materias.put(datos);
            this.limpiarFormulario();
            //this.obtenerMaterias();
            alertify.success(`Materia ${datos.nombre} guardada correctamente`);
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idMateria = 0;
            this.materia.codigo = '';
            this.materia.nombre = '';
            this.materia.uv = '';
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-8">
                <form id="frmMaterias" @submit.prevent="guardarMateria" @reset.prevent="limpiarFormulario" class="glass-card">
                    <div class="card-header">
                        <i class="bi bi-book me-2"></i>REGISTRO DE MATERIAS
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">CÓDIGO</label>
                            <input placeholder="Ej: MAT-101" required v-model="materia.codigo" type="text" class="form-control">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label text-secondary small fw-bold">NOMBRE DE LA MATERIA</label>
                            <input placeholder="Nombre de la asignatura" required v-model="materia.nombre" type="text" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">UNIDADES VALORATIVAS (UV)</label>
                            <input placeholder="Ej: 4" required v-model="materia.uv" type="number" class="form-control">
                        </div>
                    </div>

                    <div class="mt-5 d-flex gap-2 justify-content-center">
                        <button type="submit" class="btn btn-primary px-5">
                            <i class="bi bi-save me-2"></i>GUARDAR
                        </button>
                        <button type="reset" class="btn btn-warning px-4">
                            <i class="bi bi-plus-circle me-2"></i>NUEVO
                        </button>
                        <button type="button" @click="buscarMateria" class="btn btn-success px-4">
                            <i class="bi bi-search me-2"></i>BUSCAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
};