const busqueda_autores = {
    data(){
        return{
            buscar:'',
            autores:[]
        }
    },
    methods:{
        modificarAutor(autor){
            this.$emit('modificar', autor);
        },
        async obtenerAutores(){
            this.autores = await db.autores.filter(
                autor => autor.codigo.toLowerCase().includes(this.buscar.toLowerCase()) 
                    || autor.nombre.toLowerCase().includes(this.buscar.toLowerCase())
                    || autor.pais.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
        },
        async eliminarAutor(idAutor, e){
            e.stopPropagation();
            alertify.confirm("Eliminar autor", "¿Está seguro de eliminar el autor?", async () => {
                await db.autores.delete(idAutor);
                this.obtenerAutores();
                alertify.success("Autor eliminado correctamente");
            }, () => {});
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-people me-2"></i>LISTADO DE AUTORES</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerAutores()" v-model="buscar" placeholder="🔍 Buscar por nombre, código o país..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblAutores">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>NOMBRE COMPLETO</th>
                                    <th>PAÍS</th>
                                    <th>TELÉFONO</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="autor in autores" :key="autor.idAutor" @click="modificarAutor(autor)">
                                    <td><span class="badge bg-primary">{{ autor.codigo }}</span></td>
                                    <td class="fw-bold">{{ autor.nombre }}</td>
                                    <td>{{ autor.pais }}</td>
                                    <td>{{ autor.telefono }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarAutor(autor.idAutor, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="autores.length == 0">
                                    <td colspan="5" class="text-center py-5 text-secondary">
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