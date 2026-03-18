<?php
include(__DIR__ . '/../../confi/Config.php');
extract($_REQUEST);

$matriculas = $matriculas ?? '[]';
$accion = $accion ?? '';

$class_matriculas = new matriculas($conexion);
echo json_encode($class_matriculas->recibir_datos($matriculas));

class matriculas{
    private $datos = [], $db, $respuesta=['msg'=>'ok'];

    public function __construct($conexion){
        $this->db = $conexion;
    }

    public function recibir_datos($matriculas){
        global $accion;
        if($accion === 'consultar'){
            return $this->administrar_matriculas();
        } else {
            $this->datos = json_decode($matriculas, true);
            return $this->validar_datos();
        }
    }

    private function validar_datos(){
        if(empty($this->datos['codigo_alumno'])){
            $this->respuesta['msg'] = 'El código del alumno es requerido';
        }
        if(empty($this->datos['ciclo_periodo'])){
            $this->respuesta['msg'] = 'El ciclo/periodo es requerido';
        }
        return $this->administrar_matriculas();
    }

    private function administrar_matriculas(){
        global $accion;
        if($this->respuesta['msg'] !== 'ok'){
            return $this->respuesta;
        }
        if($accion === 'nuevo'){
            return $this->db->consultaSQL(
                'INSERT INTO matriculas (idMatricula, codigo_alumno, ciclo_periodo, hash) VALUES (?, ?, ?, ?)',
                $this->datos['idMatricula'],
                $this->datos['codigo_alumno'],
                $this->datos['ciclo_periodo'],
                $this->datos['hash']
            );
        } else if($accion === 'modificar'){
            return $this->db->consultaSQL(
                'UPDATE matriculas SET codigo_alumno = ?, ciclo_periodo = ?, hash = ? WHERE idMatricula = ?',
                $this->datos['codigo_alumno'],
                $this->datos['ciclo_periodo'],
                $this->datos['hash'],
                $this->datos['idMatricula']
            );
        } else if($accion === 'eliminar'){
            return $this->db->consultaSQL(
                'DELETE FROM matriculas WHERE idMatricula = ?',
                $this->datos['idMatricula']
            );
        } else if($accion === 'consultar'){
            $this->db->consultaSQL(
                'SELECT idMatricula, codigo_alumno, ciclo_periodo, hash FROM matriculas'
            );
            return $this->db->obtener_datos();
        }
    }
}
?>
