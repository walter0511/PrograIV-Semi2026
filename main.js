const { createApp } = Vue;

// Puente para el Trabajador de SQLite
const sqliteWorker = new Worker('sqlite-worker.js');
const dbRequests = new Map();
let requestId = 0;

sqliteWorker.onmessage = (e) => {
    const { id, result, error, success } = e.data;
    if (dbRequests.has(id)) {
        const { resolve, reject } = dbRequests.get(id);
        dbRequests.delete(id);
        if (error) reject(error);
        else resolve(result !== undefined ? result : success);
    }
};

window.db = {
    exec: (sql, params = []) => {
        const id = requestId++;
        return new Promise((resolve, reject) => {
            dbRequests.set(id, { resolve, reject });
            sqliteWorker.postMessage({ type: 'exec', sql, params, id });
        });
    },
    query: (sql, params = []) => {
        const id = requestId++;
        return new Promise((resolve, reject) => {
            dbRequests.set(id, { resolve, reject });
            sqliteWorker.postMessage({ type: 'query', sql, params, id });
        });
    },
    init: () => {
        const id = requestId++;
        return new Promise((resolve, reject) => {
            dbRequests.set(id, { resolve, reject });
            sqliteWorker.postMessage({ type: 'init', id });
        });
    }
};

// Inicializar BD y semillas
window.db.init().then(async (success) => {
    if (!success) {
        throw new Error("El trabajador de SQLite no pudo inicializar la base de datos.");
    }
    console.log("SQLite inicializado correctamente.");
    
    try {
        // Verificar si hay materias para insertar semillas
        const materias = await window.db.query("SELECT COUNT(*) as count FROM materias");
        if (materias && materias.length > 0 && materias[0].count === 0) {
            let defs = [
                { codigo: 'RED-101',  nombre: 'Redes',               uv: 4 },
                { codigo: 'PROG-101', nombre: 'Programacion',        uv: 4 },
                { codigo: 'ISW-101',  nombre: 'Ingenieria Software', uv: 4 },
                { codigo: 'ING-101',  nombre: 'Ingles',              uv: 4 },
                { codigo: 'ELEC-101', nombre: 'Electronica',         uv: 4 }
            ];
            
            for (const d of defs) {
                const hash = typeof sha256 !== 'undefined' ? sha256(JSON.stringify(d)) : '';
                await window.db.exec(
                    "INSERT INTO materias (codigo, nombre, uv, hash) VALUES (?, ?, ?, ?)",
                    [d.codigo, d.nombre, d.uv, hash]
                );
            }
            console.log("Semillas de materias insertadas.");
        }
    } catch (e) {
        console.error("Error al insertar semillas:", e);
    }
}).catch(err => {
    console.error("Error crítico de SQLite:", err);
    let msg = "Error al cargar la base de datos SQLite.";
    if (window.location.protocol === 'file:') {
        msg += " Parece que estás abriendo el archivo directamente. Por favor, usa un servidor local (como Live Server en VS Code).";
    } else {
        msg += " Por favor, asegúrate de usar un navegador moderno y que el servidor permita Web Workers.";
    }
    alertify.error(msg);
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