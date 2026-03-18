<?php
include(__DIR__ . '/../../confi/Config.php');
extract($_REQUEST);

$inscripciones = $inscripciones ?? '[]';
$accion = $accion ?? '';

$class_inscripciones = new inscripciones($conexion);
echo json_encode($class_inscripciones->recibir_datos($inscripciones));

class inscripciones{
    private $datos = [], $db, $respuesta=['msg'=>'ok'];

    public function __construct($conexion){
        $this->db = $conexion;
    }

    public function recibir_datos($inscripciones){
        global $accion;
        if($accion === 'consultar'){
            return $this->administrar_inscripciones();
        } else {
            $this->datos = json_decode($inscripciones, true);
            return $this->validar_datos();
        }
    }

    private function validar_datos(){
        if(empty($this->datos['codigo_alumno'])){
            $this->respuesta['msg'] = 'El código del alumno es requerido';
        }
        if(empty($this->datos['codigo_materia'])){
            $this->respuesta['msg'] = 'El código de la materia es requerido';
        }
        if(empty($this->datos['fecha_inscripcion'])){
            $this->respuesta['msg'] = 'La fecha de inscripción es requerida';
        }
        return $this->administrar_inscripciones();
    }

    private function administrar_inscripciones(){
        global $accion;
        if($this->respuesta['msg'] !== 'ok'){
            return $this->respuesta;
        }
        if($accion === 'nuevo'){
            return $this->db->consultaSQL(
                'INSERT INTO inscripciones (idInscripcion, codigo_alumno, codigo_materia, fecha_inscripcion, hash, estado, observaciones, nombre_alumno, nombre_materia, uv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                $this->datos['idInscripcion'],
                $this->datos['codigo_alumno'],
                $this->datos['codigo_materia'],
                $this->datos['fecha_inscripcion'],
                $this->datos['hash'] ?? '',
                $this->datos['estado'] ?? 'inscrito',
                $this->datos['observaciones'] ?? '',
                $this->datos['nombre_alumno'] ?? '',
                $this->datos['nombre_materia'] ?? '',
                $this->datos['uv'] ?? 0
            );
        } else if($accion === 'modificar'){
            return $this->db->consultaSQL(
                'UPDATE inscripciones SET codigo_alumno = ?, codigo_materia = ?, fecha_inscripcion = ?, hash = ?, estado = ?, observaciones = ?, nombre_alumno = ?, nombre_materia = ?, uv = ? WHERE idInscripcion = ?',
                $this->datos['codigo_alumno'],
                $this->datos['codigo_materia'],
                $this->datos['fecha_inscripcion'],
                $this->datos['hash'] ?? '',
                $this->datos['estado'] ?? 'inscrito',
                $this->datos['observaciones'] ?? '',
                $this->datos['nombre_alumno'] ?? '',
                $this->datos['nombre_materia'] ?? '',
                $this->datos['uv'] ?? 0,
                $this->datos['idInscripcion']
            );
        } else if($accion === 'eliminar'){
            return $this->db->consultaSQL(
                'DELETE FROM inscripciones WHERE idInscripcion = ?',
                $this->datos['idInscripcion']
            );
        } else if($accion === 'consultar'){
            $this->db->consultaSQL(
                'SELECT idInscripcion, codigo_alumno, codigo_materia, fecha_inscripcion, hash, estado, observaciones, nombre_alumno, nombre_materia, uv FROM inscripciones'
            );
            return $this->db->obtener_datos();
        }
    }
}
?>
