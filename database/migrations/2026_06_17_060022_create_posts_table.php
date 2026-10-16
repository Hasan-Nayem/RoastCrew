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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->unsignedBigInteger('track_id')->nullable();
            $table->foreign('track_id')->references('id')->on('tracks')->nullOnDelete();
            $table->string('title');
            $table->text('descriptions')->nullable();
            $table->decimal('distance', 10, 2)->default(0);
            $table->decimal('duration', 10, 2)->default(0);
            $table->decimal('pace', 10, 2)->default(0);
            $table->decimal('elevation', 10, 2)->default(0);
            $table->decimal('start_latitude', 11, 8);
            $table->decimal('start_longitude', 11, 8);
            $table->decimal('end_latitude', 11, 8);
            $table->decimal('end_longitude', 11, 8);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
