<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    protected $primaryKey = 'idMateria';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'idMateria',
        'codigo',
        'nombre',
        'uv',
    ];
}
