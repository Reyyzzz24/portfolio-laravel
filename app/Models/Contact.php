<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'section_eyebrow',
        'section_title',
        'form_action',
        'submit_label',
        'label',
        'value',
        'href',
        'icon_path',
        'display_order',
    ];
}
