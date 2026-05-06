<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\DocenteController;

// Rutas Alumnos
Route::get('/alumno',    [AlumnoController::class, 'index']);
Route::post('/alumno',   [AlumnoController::class, 'store']);
Route::put('/alumno',    [AlumnoController::class, 'update']);
Route::delete('/alumno', [AlumnoController::class, 'destroy']);

// Rutas Materias
Route::get('/materia',    [MateriaController::class, 'index']);
Route::post('/materia',   [MateriaController::class, 'store']);
Route::put('/materia',    [MateriaController::class, 'update']);
Route::delete('/materia', [MateriaController::class, 'destroy']);

// Rutas Docentes
Route::get('/docente',    [DocenteController::class, 'index']);
Route::post('/docente',   [DocenteController::class, 'store']);
Route::put('/docente',    [DocenteController::class, 'update']);
Route::delete('/docente', [DocenteController::class, 'destroy']);
