<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use Illuminate\Http\Request;

class DocenteController extends Controller
{
    public function index()
    {
        return response()->json(Docente::all());
    }

    public function store(Request $request)
    {
        $docente = Docente::updateOrCreate(
            ['idDocente' => $request->idDocente],
            $request->only(['idDocente', 'codigo', 'nombre', 'direccion', 'email', 'telefono', 'escalafon'])
        );
        return response()->json(['msg' => 'ok', 'data' => $docente]);
    }

    public function update(Request $request)
    {
        $docente = Docente::where('idDocente', $request->idDocente)->first();
        if ($docente) {
            $docente->update($request->only(['codigo', 'nombre', 'direccion', 'email', 'telefono', 'escalafon']));
            return response()->json(['msg' => 'ok', 'data' => $docente]);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }

    public function destroy(Request $request)
    {
        $docente = Docente::where('idDocente', $request->idDocente)->first();
        if ($docente) {
            $docente->delete();
            return response()->json(['msg' => 'ok']);
        }
        return response()->json(['msg' => 'No encontrado'], 404);
    }
}
