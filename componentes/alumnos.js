const alumnos = {
    props: ['forms'],
    data(){
        return{
            alumno:{
                idAlumno:0,
                codigo:"",
                nombre:"",
                direccion:"",
                email:"",
                telefono:""
            },
            accion:'nuevo',
            idAlumno:0,
            data_alumnos_:[]
        }
    },
    methods:{
        buscarAlumnos(){
            this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno){ 
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.email = alumno.email;
            this.alumno.telefono = alumno.telefono;
        },
        async guardarAlumno() {
            let datos = {
                idAlumno: this.accion=='modificar' ? this.idAlumno : this.getId(),
                codigo: this.alumno.codigo,
                nombre: this.alumno.nombre,
                direccion: this.alumno.direccion,
                email: this.alumno.email,
                telefono: this.alumno.telefono
            };
            db.alumnos.put(datos);
            this.limpiarFormulario();
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idAlumno = 0;
            this.alumno.codigo = '';
            this.alumno.nombre = '';
            this.alumno.direccion = '';
            this.alumno.email = '';
            this.alumno.telefono = '';
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-10">
                <form id="frmAlumnos" @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario" class="glass-card">
                    <div class="card-header">
                        <i class="bi bi-person-plus me-2"></i>REGISTRO DE ALUMNOS
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">CÓDIGO</label>
                            <input placeholder="Ej: USSS02223" required v-model="alumno.codigo" type="text" class="form-control">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label text-secondary small fw-bold">NOMBRE COMPLETO</label>
                            <input placeholder="Nombre del alumno" required v-model="alumno.nombre" type="text" class="form-control">
                        </div>
                        
                        <div class="col-12">
                            <label class="form-label text-secondary small fw-bold">DIRECCIÓN</label>
                            <input placeholder="Dirección de residencia" required v-model="alumno.direccion" type="text" class="form-control">
                        </div>
                        
                        <div class="col-md-8">
                            <label class="form-label text-secondary small fw-bold">EMAIL</label>
                            <input placeholder="correo@ugb.edu.sv" required v-model="alumno.email" type="email" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label text-secondary small fw-bold">TELÉFONO</label>
                            <input placeholder="0000-0000" required v-model="alumno.telefono" type="text" class="form-control">
                        </div>
                    </div>

                    <div class="mt-5 d-flex gap-2 justify-content-center">
                        <button type="submit" class="btn btn-primary px-5">
                            <i class="bi bi-save me-2"></i>GUARDAR
                        </button>
                        <button type="reset" class="btn btn-warning px-4">
                            <i class="bi bi-plus-circle me-2"></i>NUEVO
                        </button>
                        <button type="button" @click="buscarAlumnos" class="btn btn-success px-4">
                            <i class="bi bi-search me-2"></i>BUSCAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
};