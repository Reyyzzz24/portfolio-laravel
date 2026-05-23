<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'eyebrow',
        'title',
        'highlight',
        'description',
        'button_label',
        'button_href',
        'image',
        'image_alt',
    ];
}
