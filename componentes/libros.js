const libros = {
    props:['forms'],
    data(){
        return{
            libro:{
                idLibro:0,
                idAutor:0,
                titulo:"",
                isbn:"",
                editorial:"",
                edicion:"",
            },
            accion:'nuevo',
            autores:[]
        }
    },
    methods:{
        async obtenerAutores(){
            this.autores = await db.autores.toArray();
        },
        buscarLibro(){
            this.forms.busqueda_libros.mostrar = !this.forms.busqueda_libros.mostrar;
            this.$emit('buscar');
        },
        modificarLibro(libro) {
            this.accion = 'modificar';
            this.libro.idLibro = libro.idLibro;
            this.libro.idAutor = libro.idAutor;
            this.libro.titulo = libro.titulo;
            this.libro.isbn = libro.isbn;
            this.libro.editorial = libro.editorial;
            this.libro.edicion = libro.edicion;
        },
        async guardarLibro() {
            if(!this.libro.idAutor){
                alertify.error("Debe seleccionar un autor");
                return;
            }
            let datos = {
                idLibro: this.accion=='modificar' ? this.libro.idLibro : this.getId(),
                idAutor: this.libro.idAutor,
                titulo: this.libro.titulo,
                isbn: this.libro.isbn,
                editorial: this.libro.editorial,
                edicion: this.libro.edicion
            };
            
            await db.libros.put(datos);
            this.limpiarFormulario();
            alertify.success(`Libro "${datos.titulo}" guardado correctamente`);
        },
        getId(){
            return new Date().getTime();
        },
        limpiarFormulario(){
            this.accion = 'nuevo';
            this.libro.idLibro = 0;
            this.libro.idAutor = 0;
            this.libro.titulo = '';
            this.libro.isbn = '';
            this.libro.editorial = '';
            this.libro.edicion = '';
        },
    },
    created(){
        this.obtenerAutores();
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12 col-lg-8">
                <div class="card shadow border-0">
                    <div class="card-header bg-dark text-white py-3">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-book me-2"></i>REGISTRO DE LIBRO
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <form id="frmLibros" @submit.prevent="guardarLibro" @reset.prevent="limpiarFormulario">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">AUTOR</label>
                                    <select required v-model="libro.idAutor" class="form-select" @focus="obtenerAutores">
                                        <option value="0">Seleccione un autor</option>
                                        <option v-for="autor in autores" :key="autor.idAutor" :value="autor.idAutor">
                                            {{ autor.nombre }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-bold">ISBN(codigo)</label>
                                    <input placeholder="Ej: 978-3-16-148410-0" required v-model="libro.isbn" type="text" class="form-control">
                                </div>

                                <div class="col-md-12">
                                    <label class="form-label fw-bold">TÍTULO DEL LIBRO</label>
                                    <input placeholder="Título de la obra" required v-model="libro.titulo" type="text" class="form-control">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-bold">EDITORIAL</label>
                                    <input placeholder="Nombre de la editorial" required v-model="libro.editorial" type="text" class="form-control">
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label fw-bold">EDICIÓN</label>
                                    <input placeholder="Ej: 1ra Edición" required v-model="libro.edicion" type="text" class="form-control">
                                </div>
                            </div>

                            <div class="mt-5 d-flex gap-2 justify-content-end">
                                <button type="reset" class="btn btn-outline-light px-4">
                                    <i class="bi bi-plus-circle me-2"></i>NUEVO
                                </button>
                                <button type="button" @click="buscarLibro" class="btn btn-outline-success px-4">
                                    <i class="bi bi-search me-2"></i>BUSCAR
                                </button>
                                <button type="submit" class="btn btn-primary px-5">
                                    <i class="bi bi-save me-2"></i>GUARDAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};