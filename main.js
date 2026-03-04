const { createApp } = Vue,
    Dexie = window.Dexie;

window.db = new Dexie("db_Usss020224");
window.db.version(2).stores({
    autores: "++idAutor,codigo,nombre,pais,telefono",
    libros: "++idLibro,idAutor,titulo,isbn,editorial,edicion",
});

createApp({
    components:{
        autores,
        busqueda_autores,
        libros,
        busqueda_libros 
    },
    data(){
        return{
            forms:{
                autores:{mostrar:false},
                busqueda_autores:{mostrar:false},
                libros:{mostrar:false},
                busqueda_libros:{mostrar:false}
            }
        }
    },
    methods:{
        buscar(ventana, metodo){
            this.$refs[ventana][metodo]();
        },
        abrirVentana(ventana){
            const estadoActual = this.forms[ventana].mostrar;

            Object.keys(this.forms).forEach(key => {
                this.forms[key].mostrar = false;
            });

            this.forms[ventana].mostrar = !estadoActual;
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    },
}).mount("#app");