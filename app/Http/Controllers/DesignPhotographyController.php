<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\Photography;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DesignPhotographyController extends Controller
{
    public function index(): Response
    {
        $designs = Design::query()->orderBy('display_order')->get();
        $photographies = Photography::query()->orderBy('display_order')->get();

        return Inertia::render('design-photography/index', [
            'designs' => $designs,
            'photographies' => $photographies,
        ]);
    }

    public function showDesign(Design $design): Response
    {
        return Inertia::render('design-photography/show-design', ['item' => $design]);
    }

    public function showPhotography(Photography $photography): Response
    {
        return Inertia::render('design-photography/show-photography', ['item' => $photography]);
    }

    public function storeDesign(Request $request)
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

        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = array_filter(array_map('trim', explode(',', (string)$data['tags'])));
        }

        Design::create($data);

        return redirect()->route('design-photography.index');
    }

    public function storePhotography(Request $request)
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

        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = array_filter(array_map('trim', explode(',', (string)$data['tags'])));
        }

        Photography::create($data);

        return redirect()->route('design-photography.index');
    }
}
