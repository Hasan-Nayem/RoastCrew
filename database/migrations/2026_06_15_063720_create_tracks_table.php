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
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->decimal('distance', 10, 2)->default(0);
            $table->decimal('duration', 10, 2)->default(0);
            $table->decimal('pace', 10, 2)->default(0);
            $table->decimal('elevation', 10, 2)->default(0);
            $table->decimal('start_latitude', 11, 8);
            $table->decimal('start_longitude', 11, 8);
            $table->decimal('end_latitude', 11, 8);
            $table->decimal('end_longitude', 11, 8);
            $table->boolean('status')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
