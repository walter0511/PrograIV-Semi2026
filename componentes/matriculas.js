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
    <div class="row">
        <div class="col-6">
            <div class="card text-bg-secondary mb-3" style="max-width: 38rem;">
                <div class="card-header">REGISTRO DE MATRICULAS</div>
                <div class="card-body">
                    <div class="row p-1">
                        <div class="col-3">
                           CODIGOALUMNO:
                        </div>
                        <div class="col-6">
                            <input v-model="matricula.codigo_alumno" type="text" class="form-control">
                        </div>
                    </div>
                   <div class="row p-1">
                            <div class="col-3">Ciclo/Periodo:</div>
                            <div class="col-4">
                                <select v-model="matricula.ciclo_periodo" class="form-control">
                                <option value="" disabled>Seleccione ciclo</option>
                                    <option value="Ciclo 1-2026">Ciclo 1-2026</option>
                                    <option value="Ciclo 2-2026">Ciclo 2-2026</option>
                                </select>
                            </div>

                    </div>
                    <div class="row p-1">
                        <div class="col text-center">
                            <button type="submit"@click="guardarMatricula" id="btnguardarMatricula" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" @click="limpiarFormulario" id="btnCancelarMatricula" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarMatricula" id="btnBuscarMatricula" class="btn btn-success">BUSCAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`
};