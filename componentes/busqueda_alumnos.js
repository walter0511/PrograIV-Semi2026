const busqueda_alumnos = {
    data(){
        return{
            buscar:'',
            alumnos:[]
        }
    },
    methods:{
        modificarAlumno(alumno){
            this.$emit('modificar', alumno);
        },
        async obtenerAlumnos(){
            this.alumnos = await db.alumnos.filter(
                alumno => alumno.codigo.toLowerCase().includes(this.buscar.toLowerCase()) 
                    || alumno.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarAlumno(idAlumno, e){
            e.stopPropagation();
            if(confirm("¿Está seguro de eliminar el alumno?")){
                await db.alumnos.delete(idAlumno);
                this.obtenerAlumnos();
            }
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-people me-2"></i>LISTADO DE ALUMNOS</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerAlumnos()" v-model="buscar" placeholder="🔍 Buscar por nombre o código..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblAlumnos">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>NOMBRE COMPLETO</th>
                                    <th>DIRECCIÓN</th>
                                    <th>EMAIL</th>
                                    <th>TELÉFONO</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="alumno in alumnos" :key="alumno.idAlumno" @click="modificarAlumno(alumno)">
                                    <td><span class="badge bg-primary">{{ alumno.codigo }}</span></td>
                                    <td class="fw-bold">{{ alumno.nombre }}</td>
                                    <td class="text-secondary small">{{ alumno.direccion }}</td>
                                    <td>{{ alumno.email }}</td>
                                    <td>{{ alumno.telefono }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarAlumno(alumno.idAlumno, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="alumnos.length == 0">
                                    <td colspan="6" class="text-center py-5 text-secondary">
                                        No se encontraron resultados para su búsqueda
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};