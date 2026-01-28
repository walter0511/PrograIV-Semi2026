document.addEventListener("DOMContentLoaded", () => {
    mostrarAlumnos(); // Mostrar alumnos al cargar
    frmAlumnos.addEventListener("submit", (e) => {
        e.preventDefault();
       guardarAlumno();
    });
});


function mostrarAlumnos(){
    let $tblAlumnos = document.querySelector("#tblAlumnos > tbody"),
    n = localStorage.length;
    let filas = ""; // Variable debe inicializarse
    $tblAlumnos.innerHTML = "";
    for(let i = 0; i < n; i++){
        let key = localStorage.key(i); // Obtener la clave real
        let datos = JSON.parse(localStorage.getItem(key));
        console.log(datos);
        filas += `
        <tr>
            <td>${datos.codigo}</td>
            <td>${datos.nombre}</td>
            <td>${datos.direccion}</td>
            <td>${datos.email}</td>
            <td>${datos.telefono}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarAlumno('${datos.id}')">EDITAR</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarAlumno('${datos.id}')">ELIMINAR</button>
            </td>
        </tr>`;
    }
    $tblAlumnos.innerHTML = filas; 
}

function guardarAlumno() {
    let datos = {
        id: getId(),
        codigo: txtCodigoAlumno.value,
        nombre: txtnombreAlumno.value,
        direccion: txtDireccionAlumno.value,
        email: txtEmailAlumno.value,
        telefono: txtTelefonoAlumno.value
    }, codigoDuplicado = buscarAlumno(datos.codigo);
    if(codigoDuplicado){
        alert("El codigo del alumno ya existe, "+ codigoDuplicado.nombre);
        return; //Termina la ejecucion de la funcion
    }
    localStorage.setItem( datos.id, JSON.stringify(datos));
    limpiarFormulario();
    mostrarAlumnos(); // Actualizar la tabla
}

function getId(){
    // Nota: Esto puede causar conflictos si se borran items, pero se mantiene la logica original
    if(localStorage.length > 0) {
        // Encontrar el ID mas alto para evitar colisiones simples
        let maxId = 0;
        for(let i=0; i<localStorage.length; i++){
            let key = parseInt(localStorage.key(i));
            if(!isNaN(key) && key > maxId) maxId = key;
        }
        return maxId + 1;
    }
    return 1;
}

function limpiarFormulario(){
    frmAlumnos.reset();
}

function buscarAlumno(codigo=''){
    let n = localStorage.length;
    for(let i = 0; i < n; i++){
        let key = localStorage.key(i); // Fix here too
        let datos = JSON.parse(localStorage.getItem(key));
        if(datos?.codigo && datos.codigo.trim().toUpperCase() == codigo.trim().toUpperCase()){
            return datos;
        }
    }
    return null;
}