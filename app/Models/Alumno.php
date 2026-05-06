<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumno extends Model
{
    protected $primaryKey = 'idAlumno';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'idAlumno',
        'codigo',
        'nombre',
        'direccion',
        'email',
        'telefono',
    ];
}
