const { createApp } = Vue,
    Dexie = window.Dexie;

window.db = new Dexie("db_academica");
window.db.version(6).stores({
    alumnos: "idAlumno,codigo,nombre,direccion,email,telefono,municipio,departamento,fecha_de_nacimiento,sexo,hash",
    materias: "idMateria,codigo,nombre,uv,hash",
    docentes: "idDocente,codigo,nombre,direccion,email,telefono,escalafon,hash",
    matriculas: "idMatricula,codigo_alumno,ciclo_periodo,hash",
    inscripciones: "idInscripcion,codigo_alumno,codigo_materia,fecha_inscripcion,hash",
});

// Si hay conflicto de versión, borrar BD y recargar automáticamente
window.db.open().then(async () => {
    let count = await window.db.materias.count();
    if(count === 0){
        let defs = [
            { idMateria: new Date().getTime(),     codigo: 'RED-101',  nombre: 'Redes',               uv: 4, hash: '' },
            { idMateria: new Date().getTime() + 1, codigo: 'PROG-101', nombre: 'Programacion',        uv: 4, hash: '' },
            { idMateria: new Date().getTime() + 2, codigo: 'ISW-101',  nombre: 'Ingenieria Software', uv: 4, hash: '' },
            { idMateria: new Date().getTime() + 3, codigo: 'ING-101',  nombre: 'Ingles',              uv: 4, hash: '' },
            { idMateria: new Date().getTime() + 4, codigo: 'ELEC-101', nombre: 'Electronica',         uv: 4, hash: '' }
        ];
        if(typeof sha256 !== 'undefined') defs.forEach(d => { d.hash = sha256(JSON.stringify(d)); });
        await window.db.materias.bulkPut(defs);
    }
}).catch(err => {
    console.warn('Error abriendo BD, reiniciando...', err);
    Dexie.delete("db_academica").then(() => location.reload());
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