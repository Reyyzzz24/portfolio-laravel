<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteApp extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'image',
        'image_alt',
        'tags',
        'description',
        'link',
        'is_external',
        'display_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_external' => 'boolean',
            'tags' => 'array',
        ];
    }
}
