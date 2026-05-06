<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use Illuminate\Http\Request;

class AlumnoController extends Controller
{
    public function index()
    {
        return response()->json(Alumno::all());
    }

    public function store(Request $request)
    {
        $alumno = Alumno::updateOrCreate(
            ['idAlumno' => $request->idAlumno],
            $request->only(['idAlumno', 'codigo', 'nombre', 'direccion', 'email', 'telefono'])
        );
        return response()->json(['msg' => 'ok', 'data' => $alumno]);
    }

    public function update(Request $request)
    {
        $alumno = Alumno::where('idAlumno', $request->idAlumno)->first();
        if ($alumno) {
            $alumno->update($request->only(['codigo', 'nombre', 'direccion', 'email', 'telefono']));
            return response()->json(['msg' => 'ok', 'data' => $alumno]);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }

    public function destroy(Request $request)
    {
        $alumno = Alumno::where('idAlumno', $request->idAlumno)->first();
        if ($alumno) {
            $alumno->delete();
            return response()->json(['msg' => 'ok']);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }
}
