// Importamos la librería de SQLite desde archivos locales (ya descargados)
importScripts('sqlite3.js');

let db;
let sqlite3;

const initDb = async () => {
    try {
        console.log('Iniciando carga de SQLite WASM (Local)...');
        
        if (typeof sqlite3InitModule !== 'function') {
            throw new Error('sqlite3InitModule no está definido. ¿Se cargó correctamente el script de SQLite?');
        }

        const selfConfiguredSqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });
        sqlite3 = selfConfiguredSqlite3;
        console.log('SQLite WASM (Local) cargado. Versión:', sqlite3.version.libVersion);


        if ('opfs' in sqlite3) {
            try {
                db = new sqlite3.oo1.OpfsDb('/db_academica.sqlite3');
                console.log('SQLite OPFS persistente abierto:', db.filename);
            } catch (opfsErr) {
                console.error('Error al abrir OPFS, intentando IDB o memoria:', opfsErr);
                db = new sqlite3.oo1.DB('/db_academica.sqlite3', 'ct');
            }
        } else {
            console.warn('OPFS no disponible, usando almacenamiento temporal.');
            db = new sqlite3.oo1.DB('/db_academica.sqlite3', 'ct');
        }


        // Crear tablas si no existen (Simulando el esquema de Dexie)
        db.exec(`
            CREATE TABLE IF NOT EXISTS alumnos (
                idAlumno INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT,
                nombre TEXT,
                direccion TEXT,
                email TEXT,
                telefono TEXT,
                municipio TEXT,
                departamento TEXT,
                fecha_de_nacimiento TEXT,
                sexo TEXT,
                hash TEXT
            );
            CREATE TABLE IF NOT EXISTS materias (
                idMateria INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT,
                nombre TEXT,
                uv INTEGER,
                hash TEXT
            );
            CREATE TABLE IF NOT EXISTS docentes (
                idDocente INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT,
                nombre TEXT,
                direccion TEXT,
                email TEXT,
                telefono TEXT,
                escalafon TEXT,
                hash TEXT
            );
            CREATE TABLE IF NOT EXISTS matriculas (
                idMatricula INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo_alumno TEXT,
                ciclo_periodo TEXT,
                hash TEXT
            );
            CREATE TABLE IF NOT EXISTS inscripciones (
                idInscripcion TEXT PRIMARY KEY,
                codigo_alumno TEXT,
                nombre_alumno TEXT,
                codigo_materia TEXT,
                nombre_materia TEXT,
                uv INTEGER,
                fecha_inscripcion TEXT,
                estado TEXT,
                observaciones TEXT,
                hash TEXT
            );
        `);

        return true;
    } catch (err) {
        console.error('Error inicializando SQLite:', err);
        return false;
    }
};

self.onmessage = async (e) => {
    const { type, sql, params, id } = e.data;

    if (type === 'init') {
        const success = await initDb();
        self.postMessage({ id, success });
        return;
    }

    if (!db) {
        self.postMessage({ id, error: 'DB no inicializada' });
        return;
    }

    try {
        let result;
        if (type === 'exec') {
            // Para INSERT, UPDATE, DELETE o consultas simples
            db.exec({
                sql,
                bind: params || [],
                returnValue: "resultRows"
            });
            result = { success: true };
        } else if (type === 'query') {
            // Para SELECT
            result = db.exec({
                sql,
                bind: params || [],
                returnValue: "resultRows",
                rowMode: 'object'
            });
        }
        self.postMessage({ id, result });
    } catch (err) {
        self.postMessage({ id, error: err.message });
    }
};
