<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index()
    {
        return response()->json(Materia::all());
    }

    public function store(Request $request)
    {
        $materia = Materia::updateOrCreate(
            ['idMateria' => $request->idMateria],
            $request->only(['idMateria', 'codigo', 'nombre', 'uv'])
        );
        return response()->json(['msg' => 'ok', 'data' => $materia]);
    }

    public function update(Request $request)
    {
        $materia = Materia::where('idMateria', $request->idMateria)->first();
        if ($materia) {
            $materia->update($request->only(['codigo', 'nombre', 'uv']));
            return response()->json(['msg' => 'ok', 'data' => $materia]);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }

    public function destroy(Request $request)
    {
        $materia = Materia::where('idMateria', $request->idMateria)->first();
        if ($materia) {
            $materia->delete();
            return response()->json(['msg' => 'ok']);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }
}
