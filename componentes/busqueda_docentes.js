const busqueda_docentes = {
    data(){
        return{
            buscar:'',
            docentes:[]
        }
    },
    methods:{
        modificarDocente(docente){
            this.$emit('modificar', docente);
        },
        async obtenerDocentes(){
            this.docentes = await db.docentes.filter(
                docente => docente.codigo.toLowerCase().includes(this.buscar.toLowerCase()) 
                    || docente.nombre.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarDocente(docente, e){
            e.stopPropagation();
            alertify.confirm('Elimanar docentes', `¿Está seguro de eliminar el docente ${docente.nombre}?`, async e=>{
                await db.docentes.delete(docente.idDocente);
                this.obtenerDocentes();
                alertify.success(`Docente ${docente.nombre} eliminado correctamente`);
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-person-badge-fill me-2"></i>LISTADO DE DOCENTES</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerDocentes()" v-model="buscar" placeholder="🔍 Buscar por nombre o código..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblDocentes">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>DOCENTE</th>
                                    <th>DIRECCIÓN</th>
                                    <th>EMAIL</th>
                                    <th>TELÉFONO</th>
                                    <th>ESCALAFÓN</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="docente in docentes" :key="docente.idDocente" @click="modificarDocente(docente)">
                                    <td><span class="badge bg-primary">{{ docente.codigo }}</span></td>
                                    <td class="fw-bold">{{ docente.nombre }}</td>
                                    <td class="text-secondary small">{{ docente.direccion }}</td>
                                    <td>{{ docente.email }}</td>
                                    <td>{{ docente.telefono }}</td>
                                    <td><span class="badge rounded-pill border border-glass">{{ docente.escalafon }}</span></td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarDocente(docente, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="docentes.length == 0">
                                    <td colspan="7" class="text-center py-5 text-secondary">
                                        No se encontraron docentes registrados
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