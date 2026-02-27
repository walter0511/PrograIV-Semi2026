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
    template:  
        `<div>
            <div class="row">  
               <tr>
                 <th colspan="6">
                     <input autocomplete="off" type="search" @keyup="obtenerMatriculas()" v-model="buscar" placeholder="Buscar matricula" class="form-control">
                     </th>
            </div>
            <div class="row">
                <div class="col-12">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ALUMNO</th>
                                <th>CICLO</th>
                                <th>HASH</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="matricula in matriculas" :key="matricula.idMatricula" @click="modificarMatricula(matricula)">
                                <td>{{ matricula.codigo_alumno }}</td>
                                <td>{{ matricula.ciclo_periodo }}</td>
                                <td>{{ matricula.hash }}</td>
                                <td>
                                    <button class="btn btn-danger" @click.stop="eliminarMatricula(matricula, $event)">DEL</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`
};