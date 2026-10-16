<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('post_locations');
        Schema::dropIfExists('post_images');
        Schema::dropIfExists('posts');
        Schema::enableForeignKeyConstraints();


        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // $table->foreignId('track_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('descriptions')->nullable();

            $table->string('distance')->default('0');
            $table->string('duration')->default('0');
            $table->string('pace')->default('0');
            $table->string('elevation')->default('0');

            $table->string('start_latitude')->nullable();
            $table->string('start_longitude')->nullable();
            $table->string('end_latitude')->nullable();
            $table->string('end_longitude')->nullable();

            $table->boolean('is_published')->default(true);

            $table->timestamps();
        });

        // Create post_images table
        Schema::create('post_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('post_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->text('image');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_images');
        Schema::dropIfExists('posts');
    }
};
