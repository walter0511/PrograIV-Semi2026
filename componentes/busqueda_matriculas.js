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
            this.matriculas = await db.matriculas
                .filter(matricula =>
                    matricula.codigo_alumno?.toString().includes(this.buscar) ||
                    matricula.ciclo_periodo?.toLowerCase().includes(this.buscar.toLowerCase())
                )
                .toArray();
        },
        async eliminarMatricula(matricula, e){
            e.stopPropagation();
            await db.matriculas.delete(matricula.idMatricula);
            this.obtenerMatriculas();
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
                                    <th>CÓDIGO ALUMNO</th>
                                    <th>CICLO / PERIODO</th>
                                    <th>IDENTIFICADOR ÚNICO (HASH)</th>
                                    <th class="text-center">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)">
                                    <td class="fw-bold text-accent">{{ matricula.codigo_alumno }}</td>
                                    <td>{{ matricula.ciclo_periodo }}</td>
                                    <td><small class="text-secondary font-monospace">{{ matricula.hash?.substring(0,20) }}...</small></td>
                                    <td class="text-center">
                                        <button class="btn btn-danger btn-sm" @click.stop="eliminarMatricula(matricula, $event)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="matriculas.length == 0">
                                    <td colspan="4" class="text-center py-5 text-secondary">
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