const { createApp } = Vue;

createApp({
    data() {
        return {
            alumno: {
                codigo: "", nombre: "", direccion: "", municipio: "",
                departamento: "", telefono: "", fechaNacimiento: "",
                sexo: "", email: ""
            },
            accion: 'nuevo',
            id: 0,
            buscar: '',
            alumnos: []
        }
    },
    methods: {
        obtenerAlumnos() {
            let n = localStorage.length;
            this.alumnos = [];
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (!isNaN(key)) {
                    let data = JSON.parse(localStorage.getItem(key));
                    if (data.nombre.toUpperCase().includes(this.buscar.toUpperCase()) ||
                        data.codigo.toUpperCase().includes(this.buscar.toUpperCase())) {
                        this.alumnos.push(data);
                    }
                }
            }
        },
        eliminarAlumno(id, e) {
            e.stopPropagation();
            if (confirm("¿Está seguro de eliminar este registro?")) {
                localStorage.removeItem(id);
                this.obtenerAlumnos();
                if(this.id === id) this.limpiarFormulario();
            }
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.id = alumno.id;
            // Copiamos los datos al formulario
            Object.assign(this.alumno, alumno);
        },
        guardarAlumno() {
            let currentId = this.accion == 'modificar' ? this.id : new Date().getTime();
            let datos = { id: currentId, ...this.alumno };

            if(this.accion == 'nuevo' && this.buscarAlumno(datos.codigo)) {
                alert("Este código ya pertenece a otro alumno.");
                return;
            }

            localStorage.setItem(currentId, JSON.stringify(datos));
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.id = 0;
            Object.keys(this.alumno).forEach(key => this.alumno[key] = "");
        },
        buscarAlumno(codigo) {
            return this.alumnos.find(a => a.codigo.trim().toUpperCase() === codigo.trim().toUpperCase());
        }
    },
    mounted() {
        this.obtenerAlumnos();
    }
}).mount("#app");