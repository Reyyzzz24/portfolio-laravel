<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSection extends Model
{
    protected $fillable = [
        'section_eyebrow',
        'section_title',
        'form_action',
        'submit_label',
    ];
}
