<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id('id');
            $table->uuid('idInscripcion')->nullable();
            $table->string('codigo_alumno', 10)->nullable();
            $table->string('materia', 100)->nullable();
            $table->string('fecha_inscripcion', 50)->nullable();
            $table->string('ciclo_periodo', 50)->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripciones');
    }
};
