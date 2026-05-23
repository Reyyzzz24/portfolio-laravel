<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/hero', [
            'hero' => HeroSection::query()->first() ?? new HeroSection()
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'highlight' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'button_label' => ['required', 'string', 'max:255'],
            'button_href' => ['required', 'string', 'max:255'],
            'image_alt' => ['required', 'string', 'max:255'],
            'image' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_string($value) && !$value instanceof \Illuminate\Http\UploadedFile) {
                        $fail("The {$attribute} must be a valid image file or string path.");
                    }
                }
            ],
        ]);

        $hero = HeroSection::query()->firstOrCreate([]);
        
        if ($request->hasFile('image')) {
            if ($hero->image && str_starts_with($hero->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $hero->image));
            }
            $path = $request->file('image')->store('portfolios', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $hero->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Hero section updated.']);
        return back();
    }
}