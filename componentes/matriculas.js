const matriculas = {
    props:['forms'],
    data(){
        return{
            matricula:{
                idMatricula:'',
                codigo_alumno:'',
                ciclo_periodo:'',
                hash:'',
            },
            accion:'nuevo',
            idMatricula:0,
        }
    },
    methods:{
        buscarMatricula(){
    this.forms.busqueda_matriculas.mostrar =
        !this.forms.busqueda_matriculas.mostrar;
    this.$emit('buscar');
        },
        modificarMatricula(matricula){
            this.accion = 'modificar';
            this.idMatricula = matricula.idMatricula;
            this.matricula.codigo_alumno = matricula.codigo_alumno;
            this.matricula.ciclo_periodo = matricula.ciclo_periodo;
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idMatricula = '';
            this.matricula.codigo_alumno = '';
            this.matricula.ciclo_periodo = '';
        },
        async guardarMatricula(){

    if(!this.matricula.codigo_alumno){
        alertify.error("Ingrese un código de alumno");
        return;
    }

    
    let alumno = await db.alumnos
        .where("codigo")
        .equals(this.matricula.codigo_alumno)
        .first();

    if(!alumno){
        alertify.error("El alumno no existe, no puede matricularse");
        return;
    }

    let datos = {
        idMatricula: this.accion=='modificar'
            ? this.idMatricula
            : new Date().getTime(),
        codigo_alumno: this.matricula.codigo_alumno,
        ciclo_periodo: this.matricula.ciclo_periodo
    };

    datos.hash = sha256(JSON.stringify(datos));

    await db.matriculas.put(datos);

    this.limpiarFormulario();
    alertify.success("Matricula guardada correctamente");
}
    },

    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-6">
                <div class="glass-card">
                    <div class="card-header">
                        <i class="bi bi-card-checklist me-2"></i>REGISTRO DE MATRÍCULAS
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label text-secondary small fw-bold">CÓDIGO DEL ALUMNO</label>
                            <input placeholder="Busque el código del alumno" v-model="matricula.codigo_alumno" type="text" class="form-control">
                        </div>
                        <div class="col-12">
                            <label class="form-label text-secondary small fw-bold">CICLO / PERIODO ACADÉMICO</label>
                            <select v-model="matricula.ciclo_periodo" class="form-select">
                                <option value="" disabled>Seleccione el ciclo...</option>
                                <option value="Ciclo 1-2026">Ciclo 1-2026</option>
                                <option value="Ciclo 2-2026">Ciclo 2-2026</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-5 d-flex gap-2 justify-content-center">
                        <button type="submit" @click="guardarMatricula" class="btn btn-primary px-5">
                            <i class="bi bi-save me-2"></i>GUARDAR
                        </button>
                        <button type="reset" @click="limpiarFormulario" class="btn btn-warning px-4">
                            <i class="bi bi-plus-circle me-2"></i>NUEVO
                        </button>
                        <button type="button" @click="buscarMatricula" class="btn btn-success px-4">
                            <i class="bi bi-search me-2"></i>BUSCAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
};