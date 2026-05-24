<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteApp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteAppController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/website-app', [
            'apps' => WebsiteApp::query()->orderBy('display_order')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'apps' => ['required', 'array'],
            'apps.*.id' => ['required'],
            'apps.*.title' => ['required', 'string', 'max:255'],
            'apps.*.image' => ['nullable'],
            'apps.*.image_alt' => ['required_with:apps.*.image', 'nullable', 'string', 'max:255'],
            'apps.*.tags' => ['nullable'],
            'apps.*.description' => ['nullable', 'string'],
            'apps.*.link' => ['nullable', 'string', 'max:2048'],
            'apps.*.is_external' => ['required', 'boolean'],
            'apps.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        $keptIds = [];

        foreach ($validated['apps'] as $index => $row) {
            $id = $row['id'];

            $data = [
                'title' => $row['title'],
                'image_alt' => $row['image_alt'] ?? null,
                'tags' => is_array($row['tags']) ? $row['tags'] : ($row['tags'] ?? null),
                'description' => $row['description'] ?? null,
                'link' => $row['link'] ?? null,
                'is_external' => (bool)$row['is_external'],
                'display_order' => (int)$row['display_order'],
            ];

            if ($request->hasFile("apps.{$index}.image")) {
                $path = $request->file("apps.{$index}.image")->store('website_apps', 'public');
                $data['image'] = '/storage/' . $path;
            }

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = WebsiteApp::create($data);
                $keptIds[] = $new->id;
            } else {
                $existing = WebsiteApp::query()->findOrFail($id);
                if (isset($data['image']) && $existing->image && str_starts_with($existing->image, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $existing->image));
                }
                $existing->update($data);
                $keptIds[] = $existing->id;
            }
        }

        WebsiteApp::query()->whereNotIn('id', $keptIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Website & App collection updated.']);

        return back();
    }
}
