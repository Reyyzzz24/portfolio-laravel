<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Navbar extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'brand',
        'resume_label',
        'documents_label',
        'item_type',
        'label',
        'href',
        'display_order',
    ];
}
