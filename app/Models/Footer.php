<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'copyright',
        'name',
        'url',
        'icon_path',
        'hover_class',
        'display_order',
    ];
}
