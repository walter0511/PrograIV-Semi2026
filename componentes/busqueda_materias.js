const busqueda_materias = {
    data(){
        return{
            buscar:'',
            materias:[]
        }
    },
    methods:{
        modificarMateria(materia){
            this.$emit('modificar', materia);
        },
        async obtenerMaterias(){
            let buscar = (this.buscar || '').toLowerCase();
            this.materias = await db.materias.orderBy('codigo').filter(materia => {
                let codigo = (materia.codigo || '').toLowerCase();
                let nombre = (materia.nombre || '').toLowerCase();
                return codigo.includes(buscar) || nombre.includes(buscar);
            }).toArray();
        },
        async eliminarMateria(materia, e){
            e.stopPropagation();
            alertify.confirm('Eliminar materias', `¿Está seguro de eliminar el materia ${materia.nombre}?`, async e=>{
                await db.materias.delete(materia.idMateria);
                this.obtenerMaterias();
                alertify.success(`Materia ${materia.nombre} eliminada correctamente`);
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
                        <span><i class="bi bi- Mortarboard me-2"></i>LISTADO DE MATERIAS</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerMaterias()" v-model="buscar" placeholder="🔍 Buscar materia..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblMaterias">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>NOMBRE DE ASIGNATURA</th>
                                    <th>UV</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="materia in materias" :key="materia.idMateria" @click="modificarMateria(materia)">
                                    <td><span class="badge bg-accent">{{ materia.codigo }}</span></td>
                                    <td class="fw-bold">{{ materia.nombre }}</td>
                                    <td><span class="badge rounded-pill bg-secondary">{{ materia.uv }} UV</span></td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarMateria(materia, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="materias.length == 0">
                                    <td colspan="4" class="text-center py-5 text-secondary">
                                        No se encontraron materias registradas
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