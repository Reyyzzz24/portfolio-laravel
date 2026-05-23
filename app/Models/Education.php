<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'education';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'institution',
        'degree',
        'period',
        'is_current',
        'display_order',
    ];

    /**
     * Casting tipe data bawaan database ke tipe data PHP.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_current' => 'boolean',
        'display_order' => 'integer',
    ];
}