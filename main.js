const { createApp } = Vue,
    Dexie = window.Dexie,
    sha256 = CryptoJS.SHA256;

     window.db = new Dexie("db_academica");
    window.db.version(2).stores({
        alumnos: "++idAlumno,codigo,nombre,direccion,email,telefono,municipio,departamento,fecha_de_nacimiento,sexo,hash",
        materias: "++idMateria,codigo,nombre,uv,hash",
        docentes: "++idDocente,codigo,nombre,direccion,email,telefono,escalafon,hash",
        matriculas: "++idMatricula,codigo_alumno,ciclo_periodo,hash",
        inscripciones: "++idInscripcion,codigo_alumno,codigo_materia,fecha_inscripcion,ciclo_periodo,hash",
    });

createApp({
    components:{
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes,
        matriculas,
        busqueda_matriculas,
        inscripciones,
        busqueda_inscripciones
        
    },
    data(){
        return{
            forms:{
                alumnos:{mostrar:false},
                busqueda_alumnos:{mostrar:false},
                materias:{mostrar:false},
                busqueda_materias:{mostrar:false},
                docentes:{mostrar:false},
                busqueda_docentes:{mostrar:false},
                matriculas:{mostrar:false},
                busqueda_matriculas:{mostrar:false},
                inscripciones:{mostrar:false},
                busqueda_inscripciones:{mostrar:false}
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