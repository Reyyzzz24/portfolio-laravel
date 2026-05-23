<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Models\Skill;
use App\Models\Project as Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'sectionCount' => 7, // Sesuaikan dengan jumlah total bagian yang dapat diedit
            'skillCount' => Skill::count(),
            'educationCount' => Education::count(),
            'lastUpdated' => Portfolio::latest()->first()?->updated_at?->diffForHumans()
        ]);
    }
}