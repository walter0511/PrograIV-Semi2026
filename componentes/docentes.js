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
            
            if(this.accion == 'nuevo'){
                let existe = await db.query("SELECT * FROM docentes WHERE codigo = ?", [datos.codigo]);
                if(existe.length > 0){
                    alertify.error(`El codigo del docente ya existe: ${existe[0].nombre}`);
                    return;
                }
            }

            datos.hash = typeof sha256 !== 'undefined' ? sha256(JSON.stringify(datos)) : '';
            
            await db.exec(`
                INSERT OR REPLACE INTO docentes (idDocente, codigo, nombre, direccion, email, telefono, escalafon, hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [datos.idDocente, datos.codigo, datos.nombre, datos.direccion, datos.email, datos.telefono, datos.escalafon, datos.hash]);

            this.limpiarFormulario();
            alertify.success(`${datos.nombre} guardado correctamente`);
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
        <div class="row">
            <div class="col-6">
                <form id="frmDocentes" @submit.prevent="guardarDocente" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 40rem;">
                        <div class="card-header">REGISTRO DE DOCENTES</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">
                                    CÓDIGO:
                                </div>
                                <div class="col-4">
                                    <input placeholder="codigo" required v-model="docente.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    NOMBRE:
                                </div>
                                <div class="col-8">
                                    <input placeholder="nombre" required v-model="docente.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    DIRECCION:
                                </div>
                                <div class="col-9">
                                    <input placeholder="direccion" required v-model="docente.direccion" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    EMAIL:
                                </div>
                                <div class="col-6">
                                    <input placeholder="email" required v-model="docente.email" type="email" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    TELEFONO:
                                </div>
                                <div class="col-4">
                                    <input placeholder="telefono" required v-model="docente.telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    ESCALAFÓN:
                                </div>
                                <div class="col-6">
                                    <select required v-model="docente.escalafon" class="form-select">
                                        <option value="" disabled>Seleccione...</option>
                                        <option value="tecnico">Técnico</option>
                                        <option value="profesor">Profesor</option>
                                        <option value="ingeniero">Licenciado/Ingeniero</option>
                                        <option value="maestria">Maestría</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarDocente" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarDocente" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarDocente" id="btnBuscarDocente" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};