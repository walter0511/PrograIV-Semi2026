const busqueda_libros = {
    data(){
        return{
            buscar:'',
            libros:[]
        }
    },
    methods:{
        modificarLibro(libro){
            this.$emit('modificar', libro);
        },
        async obtenerLibros(){
            let libros = await db.libros.filter(
                libro => libro.titulo.toLowerCase().includes(this.buscar.toLowerCase()) 
                    || libro.isbn.toLowerCase().includes(this.buscar.toLowerCase())
                    || libro.editorial.toLowerCase().includes(this.buscar.toLowerCase())
            ).toArray();
            
            // Map author name to each book
            const autores = await db.autores.toArray();
            this.libros = libros.map(libro => {
                const autor = autores.find(a => a.idAutor == libro.idAutor);
                return {
                    ...libro,
                    nombreAutor: autor ? autor.nombre : 'Desconocido'
                };
            });
        },
        async eliminarLibro(libro, e){
            e.stopPropagation();
            alertify.confirm('Eliminar libro', `¿Está seguro de eliminar el libro "${libro.titulo}"?`, async ()=>{
                await db.libros.delete(libro.idLibro);
                this.obtenerLibros();
                alertify.success(`Libro "${libro.titulo}" eliminado correctamente`);
            }, () => {});
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-book me-2"></i>LISTADO DE LIBROS</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerLibros()" v-model="buscar" placeholder="🔍 Buscar por título, ISBN o editorial..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblLibros">
                            <thead>
                                <tr>
                                    <th>TÍTULO</th>
                                    <th>AUTOR</th>
                                    <th>ISBN(codigo)</th>
                                    <th>EDITORIAL</th>
                                    <th>EDICIÓN</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="libro in libros" :key="libro.idLibro" @click="modificarLibro(libro)">
                                    <td class="fw-bold text-primary">{{ libro.titulo }}</td>
                                    <td>{{ libro.nombreAutor }}</td>
                                    <td><span class="badge bg-light text-dark border">{{ libro.isbn }}</span></td>
                                    <td>{{ libro.editorial }}</td>
                                    <td>{{ libro.edicion }}</td>
                                    <td class="text-center">
                                        <button class="btn btn-outline-danger btn-sm" @click.stop="eliminarLibro(libro, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="libros.length == 0">
                                    <td colspan="6" class="text-center py-5 text-secondary">
                                        No se encontraron libros registrados
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