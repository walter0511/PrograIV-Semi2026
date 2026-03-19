const busqueda_materias = {
    data(){
        return{
            buscar:'',
            materias:[]
        }
    },
    methods:{
        modificarMateria(materia){
            this.$emit('modificar', materia);
        },
        async obtenerMaterias(){
            try {
                let resp = await fetch('private/modulos/materias/materia.php?accion=consultar');
                let text = await resp.text();

                if (!text.trim().startsWith('<?php') && !text.trim().startsWith('<')) {
                    let data = JSON.parse(text);
                    if(Array.isArray(data)){
                        await db.exec("DELETE FROM materias");
                        for (const m of data) {
                            await db.exec(`
                                INSERT OR REPLACE INTO materias (idMateria, codigo, nombre, uv, hash)
                                VALUES (?, ?, ?, ?, ?)
                            `, [m.idMateria, m.codigo, m.nombre, m.uv, m.hash]);
                        }
                    }
                }
            } catch(e) { 
                // Silenced: local mode fallback
            }

            let buscar = `%${this.buscar}%`;
            this.materias = await db.query(
                "SELECT * FROM materias WHERE nombre LIKE ? OR codigo LIKE ? ORDER BY codigo",
                [buscar, buscar]
            );
        },
        async eliminarMateria(materia, e){
            e.stopPropagation();
            alertify.confirm('Eliminar materias', `¿Está seguro de eliminar la materia ${materia.nombre}?`, async () => {
                // Eliminar localmente (SQLite)
                await db.exec("DELETE FROM materias WHERE idMateria = ?", [materia.idMateria]);
                this.obtenerMaterias();
                alertify.success(`Materia ${materia.nombre} eliminada correctamente`);

                // Sincronizar con servidor (silencioso)
                fetch(`private/modulos/materias/materia.php?accion=eliminar&materias=${encodeURIComponent(JSON.stringify(materia))}`)
                    .then(res => res.text())
                    .then(text => {
                        if (!text.trim().startsWith('<')) {
                            let resp = JSON.parse(text);
                            if (resp.msg !== 'ok' && resp !== true) console.warn("Aviso servidor:", resp);
                        }
                    })
                    .catch(() => {});
            }, () => {
                //No hacer nada
            });
        },
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi- Mortarboard me-2"></i>LISTADO DE MATERIAS</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerMaterias()" v-model="buscar" placeholder="🔍 Buscar materia..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover" id="tblMaterias">
                            <thead>
                                <tr>
                                    <th>CÓDIGO</th>
                                    <th>NOMBRE DE ASIGNATURA</th>
                                    <th>UV</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="materia in materias" :key="materia.idMateria" @click="modificarMateria(materia)">
                                    <td><span class="badge bg-accent">{{ materia.codigo }}</span></td>
                                    <td class="fw-bold">{{ materia.nombre }}</td>
                                    <td><span class="badge rounded-pill bg-secondary">{{ materia.uv }} UV</span></td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarMateria(materia, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="materias.length == 0">
                                    <td colspan="4" class="text-center py-5 text-secondary">
                                        No se encontraron materias registradas
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