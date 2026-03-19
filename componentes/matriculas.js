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
            this.matricula.hash = matricula.hash;
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.idMatricula = '';
            this.matricula.codigo_alumno = '';
            this.matricula.ciclo_periodo = '';
            this.matricula.hash = '';
        },
        async guardarMatricula(){

    if(!this.matricula.codigo_alumno){
        alertify.error("Ingrese un código de alumno");
        return;
    }

    
    /*
    // Verificar existencia del alumno - El usuario prefiere poder matricular primero
    let alumno = await db.query("SELECT * FROM alumnos WHERE codigo = ?", [this.matricula.codigo_alumno]);

    if(alumno.length === 0){
        alertify.error("El alumno no existe, no puede matricularse");
        return;
    }
    */

    let datos = {
        idMatricula: this.accion=='modificar'
            ? this.idMatricula
            : new Date().getTime(),
        codigo_alumno: this.matricula.codigo_alumno,
        ciclo_periodo: this.matricula.ciclo_periodo
    };

    datos.hash = sha256(JSON.stringify(datos));

    await db.exec(`
        INSERT OR REPLACE INTO matriculas (idMatricula, codigo_alumno, ciclo_periodo, hash)
        VALUES (?, ?, ?, ?)
    `, [datos.idMatricula, datos.codigo_alumno, datos.ciclo_periodo, datos.hash]);

    // Sincronizar con servidor
    fetch(`private/modulos/matriculas/matricula.php?accion=${this.accion}&matriculas=${encodeURIComponent(JSON.stringify(datos))}`)
        .then(response => response.json())
        .then(data => {
            if(data != true && data?.msg !== 'ok') console.warn('Respuesta servidor matricula:', data);
        })
        .catch(() => {});

    this.limpiarFormulario();
    alertify.success("Matricula guardada correctamente");
}
    },

    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmMatriculas" @submit.prevent="guardarMatricula" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                        <div class="card-header">REGISTRO DE MATRICULAS</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-4">
                                    ID MATRICULA:
                                </div>
                                <div class="col-8">
                                    <input :placeholder="accion === 'modificar' ? idMatricula.toString() : 'Auto-generado'" v-model="matricula.idMatricula" type="text" class="form-control" readonly>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-4">
                                    CODIGO ALUMNO:
                                </div>
                                <div class="col-8">
                                    <input placeholder="codigo alumno" required v-model="matricula.codigo_alumno" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-4">
                                    CICLO/PERIODO:
                                </div>
                                <div class="col-8">
                                    <select v-model="matricula.ciclo_periodo" class="form-select" required>
                                        <option value="" disabled>Seleccione el ciclo...</option>
                                        <option value="Ciclo 1-2026">Ciclo 1-2026</option>
                                        <option value="Ciclo 2-2026">Ciclo 2-2026</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarMatricula" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarMatricula" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarMatricula" id="btnBuscarMatricula" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};