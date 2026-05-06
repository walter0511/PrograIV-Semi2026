<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>::. Sistema Academico ..::</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <!-- CSS AlertifyJS -->
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/alertify.min.css"/>
        <!-- Default theme -->
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/default.min.css"/>
        <!-- Bootstrap theme -->
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/css/themes/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"/>
    </head>
    <body class="antialiased">
        <div id="appSistema">
            <nav class="navbar navbar-expand-lg bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">::.. SISTEMA ACADEMICO <div class=""></div>.::</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                            <a class="nav-link" href="#" @click.prevent="abrirVentana('alumnos')">Alumnos</a>
                            <a class="nav-link" href="#" @click.prevent="abrirVentana('materias')">Materias</a>
                            <a class="nav-link" href="#" @click.prevent="abrirVentana('docentes')">Docentes</a>
                            <a class="nav-link" href="#" @click.prevent="abrirVentana('matriculas')">Matriculas</a>
                            <a class="nav-link" href="#" @click.prevent="abrirVentana('inscripciones')">Inscripciones</a>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="container-fluid" style="position: absolute; min-height: 80vh;">

                <!-- ALUMNOS -->
                <alumnos
                    @buscar='buscar("buscar_alumnos","obtenerAlumnos")'
                    :forms="forms"
                    ref="alumnos"
                    v-show="forms.alumnos.mostrar">
                </alumnos>
                <buscar_alumnos
                    @modificar='modificar("alumnos","modificarAlumno", $event)'
                    :forms="forms"
                    ref="buscar_alumnos"
                    v-show="forms.buscar_alumnos.mostrar">
                </buscar_alumnos>

                <!-- MATERIAS -->
                <materias
                    @buscar='buscar("buscar_materias","obtenerMaterias")'
                    :forms="forms"
                    ref="materias"
                    v-show="forms.materias.mostrar">
                </materias>
                <buscar_materias
                    @modificar='modificar("materias","modificarMateria", $event)'
                    :forms="forms"
                    ref="buscar_materias"
                    v-show="forms.buscar_materias.mostrar">
                </buscar_materias>

                <!-- DOCENTES -->
                <docentes
                    @buscar='buscar("buscar_docentes","obtenerDocentes")'
                    :forms="forms"
                    ref="docentes"
                    v-show="forms.docentes.mostrar">
                </docentes>
                <buscar_docentes
                    @modificar='modificar("docentes","modificarDocente", $event)'
                    :forms="forms"
                    ref="buscar_docentes"
                    v-show="forms.buscar_docentes.mostrar">
                </buscar_docentes>

</div>
        </div>

        @vite('resources/js/app.js')
    </body>
</html>