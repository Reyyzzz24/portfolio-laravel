<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectSection extends Model
{
    // Pastikan kedua kolom ini ada di sini
    protected $fillable = [
        'section_eyebrow',
        'section_title',
    ];
}