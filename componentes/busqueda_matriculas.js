const busqueda_matriculas = {
    props:['forms'],
    data(){
        return{
            buscar:'',
            matriculas:[]
        }
    },
    methods:{
        modificarMatricula(matricula){
            this.$emit('modificar', matricula);
        },
        async obtenerMatriculas(){
            try {
                let resp = await fetch('private/modulos/matriculas/matricula.php?accion=consultar');
                let text = await resp.text();

                if (!text.trim().startsWith('<?php') && !text.trim().startsWith('<')) {
                    let data = JSON.parse(text);
                    if(Array.isArray(data)){
                        await db.exec("DELETE FROM matriculas");
                        for (const m of data) {
                            await db.exec(`
                                INSERT OR REPLACE INTO matriculas (idMatricula, codigo_alumno, ciclo_periodo, hash)
                                VALUES (?, ?, ?, ?)
                            `, [m.idMatricula, m.codigo_alumno, m.ciclo_periodo, m.hash]);
                        }
                    }
                }
            } catch(e) { 
                // Silenced: local mode fallback
            }

            let buscar = `%${this.buscar}%`;
            this.matriculas = await db.query(
                "SELECT * FROM matriculas WHERE codigo_alumno LIKE ? OR ciclo_periodo LIKE ?",
                [buscar, buscar]
            );
        },
        async eliminarMatricula(matricula, e){
            e.stopPropagation();
            if(confirm("¿Está seguro de eliminar la matrícula?")){
                // Eliminar localmente (SQLite)
                await db.exec("DELETE FROM matriculas WHERE idMatricula = ?", [matricula.idMatricula]);
                this.obtenerMatriculas();
                alertify.success('Matrícula eliminada con éxito');

                // Sincronizar con servidor (silencioso)
                fetch(`private/modulos/matriculas/matricula.php?accion=eliminar&matriculas=${encodeURIComponent(JSON.stringify(matricula))}`)
                    .then(res => res.text())
                    .then(text => {
                        if (!text.trim().startsWith('<')) {
                            let resp = JSON.parse(text);
                            if (resp.msg !== 'ok' && resp !== true) console.warn("Aviso servidor:", resp);
                        }
                    })
                    .catch(() => {});
            }
        }
    },
    template: `
        <div class="row justify-content-center view-enter">
            <div class="col-12">
                <div class="glass-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-list-check me-2"></i>CONTROL DE MATRÍCULAS</span>
                        <div class="w-50">
                            <input autocomplete="off" type="search" @keyup="obtenerMatriculas()" v-model="buscar" placeholder="🔍 Buscar por código de alumno o ciclo..." class="form-control">
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID MATRÍCULA</th>
                                    <th>CÓDIGO ALUMNO</th>
                                    <th>CICLO / PERIODO</th>
                                    <th>HASH</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)">
                                    <td class="font-monospace text-secondary" style="font-size:0.75rem;">{{ matricula.idMatricula }}</td>
                                    <td class="fw-bold text-accent">{{ matricula.codigo_alumno }}</td>
                                    <td>{{ matricula.ciclo_periodo }}</td>
                                    <td><small class="text-secondary font-monospace" style="word-break:break-all;">{{ matricula.hash }}</small></td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarMatricula(matricula, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="matriculas.length == 0">
                                    <td colspan="5" class="text-center py-5 text-secondary">
                                        No se encontraron registros de matrícula
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