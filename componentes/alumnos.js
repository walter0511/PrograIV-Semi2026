const alumnos = {
    props:['forms'],
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
            data_alumnos:[]
        }
    },
    methods:{
        buscarAlumno(){
            this.forms.busqueda_alumnos.mostrar = !this.forms.busqueda_alumnos.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.alumno.codigo = alumno.codigo;
            this.alumno.nombre = alumno.nombre;
            this.alumno.direccion = alumno.direccion;
            this.alumno.telefono = alumno.telefono;
            this.alumno.email = alumno.email;
        },
        async guardarAlumno() {
            try {
                let datos = {
                    idAlumno: this.accion=='modificar' ? this.idAlumno : this.getId(),
                    codigo: this.alumno.codigo,
                    nombre: this.alumno.nombre,
                    direccion: this.alumno.direccion,
                    email: this.alumno.email,
                    telefono: this.alumno.telefono
                };

                // Verificar duplicado buscando el código
                if(this.accion == 'nuevo'){
                    let existe = await db.query("SELECT * FROM alumnos WHERE codigo = ?", [datos.codigo]);
                    if(existe.length > 0){
                        alertify.error(`El codigo ya existe: ${existe[0].nombre}`);
                        return;
                    }
                }

                datos.hash = typeof sha256 !== 'undefined' ? sha256(JSON.stringify(datos)) : '';
                
                // Usar INSERT OR REPLACE para simular el comportamiento de put de Dexie
                await db.exec(`
                    INSERT OR REPLACE INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono, hash)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [datos.idAlumno, datos.codigo, datos.nombre, datos.direccion, datos.email, datos.telefono, datos.hash]);

                // Sincronizar con servidor (si falla no afecta el guardado local)
                try {
                    let resp = await fetch(`private/modulos/alumnos/alumno.php?accion=${this.accion}&alumnos=${encodeURIComponent(JSON.stringify(datos))}`);
                    let data = await resp.json();
                    if(data != true && data?.msg !== 'ok') {
                        console.warn(`Aviso de servidor local: ${data?.msg || 'Datos inválidos'}`);
                    }
                } catch(e) { /* Servidor local inactivo, podemos ignorar en modo offline */ }


                this.limpiarFormulario();
                alertify.success(`${datos.nombre} guardado correctamente`);

            } catch(err) {
                alertify.error(`Error al guardar: ${err.message || err}`);
                console.error('guardarAlumno error:', err);
            }
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
        <div class="row">
            <div class="col-6">
                <form id="frmAlumnos" @submit.prevent="guardarAlumno" @reset.prevent="limpiarFormulario">
                    <div class="card text-bg-dark mb-3" style="max-width: 36rem;">
                        <div class="card-header">REGISTRO DE ALUMNOS</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">
                                    CODIGO:
                                </div>
                                <div class="col-3">
                                    <input placeholder="codigo" required v-model="alumno.codigo" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    NOMBRE:
                                </div>
                                <div class="col-6">
                                    <input placeholder="nombre" required v-model="alumno.nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    DIRECCION:
                                </div>
                                <div class="col-9">
                                    <input placeholder="direccion" required v-model="alumno.direccion" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    EMAIL:
                                </div>
                                <div class="col-6">
                                    <input placeholder="email" required v-model="alumno.email" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">
                                    TELEFONO:
                                </div>
                                <div class="col-4">
                                    <input placeholder="telefono" required v-model="alumno.telefono" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="submit" id="btnGuardarAlumno" class="btn btn-primary">GUARDAR</button>
                                    <button type="reset" id="btnCancelarAlumno" class="btn btn-warning">NUEVO</button>
                                    <button type="button" @click="buscarAlumno" id="btnBuscarAlumno" class="btn btn-success">BUSCAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};