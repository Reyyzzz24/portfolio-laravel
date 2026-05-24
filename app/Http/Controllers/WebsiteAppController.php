<?php

namespace App\Http\Controllers;

use App\Models\WebsiteApp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteAppController extends Controller
{
    public function index(): Response
    {
        $items = WebsiteApp::orderBy('display_order')->get();

        return Inertia::render('website-app/index', [
            'items' => $items,
        ]);
    }

    public function show(WebsiteApp $website_app): Response
    {
        return Inertia::render('website-app/show', [
            'item' => $website_app,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|string|max:2048',
            'image_alt' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'description' => 'nullable|string',
            'link' => 'nullable|string|max:2048',
            'is_external' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
        ]);

        // Normalize tags if sent as comma-separated string
        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = array_filter(array_map('trim', explode(',', (string)$data['tags'])));
        }

        $websiteApp = WebsiteApp::create($data);

        return redirect()->route('website-app.index');
    }
}
