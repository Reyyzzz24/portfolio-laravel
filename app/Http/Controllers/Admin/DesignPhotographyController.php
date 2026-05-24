<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Design;
use App\Models\Photography;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DesignPhotographyController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/design-photography', [
            'designs' => Design::query()->orderBy('display_order')->get(),
            'photographies' => Photography::query()->orderBy('display_order')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'designs' => ['required', 'array'],
            'designs.*.id' => ['required'],
            'designs.*.title' => ['required', 'string', 'max:255'],
            'designs.*.image' => ['nullable'],
            'designs.*.image_alt' => ['nullable', 'string', 'max:255'],
            'designs.*.tags' => ['nullable'],
            'designs.*.description' => ['nullable', 'string'],
            'designs.*.link' => ['nullable', 'string', 'max:2048'],
            'designs.*.is_external' => ['required', 'boolean'],
            'designs.*.display_order' => ['required', 'integer', 'min:0'],

            'photographies' => ['required', 'array'],
            'photographies.*.id' => ['required'],
            'photographies.*.title' => ['required', 'string', 'max:255'],
            'photographies.*.image' => ['nullable'],
            'photographies.*.image_alt' => ['nullable', 'string', 'max:255'],
            'photographies.*.tags' => ['nullable'],
            'photographies.*.description' => ['nullable', 'string'],
            'photographies.*.link' => ['nullable', 'string', 'max:2048'],
            'photographies.*.is_external' => ['required', 'boolean'],
            'photographies.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        $keptDesignIds = [];
        foreach ($validated['designs'] as $index => $row) {
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

            if ($request->hasFile("designs.{$index}.image")) {
                $path = $request->file("designs.{$index}.image")->store('designs', 'public');
                $data['image'] = '/storage/' . $path;
            }

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Design::create($data);
                $keptDesignIds[] = $new->id;
            } else {
                $existing = Design::query()->findOrFail($id);
                if (isset($data['image']) && $existing->image && str_starts_with($existing->image, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $existing->image));
                }
                $existing->update($data);
                $keptDesignIds[] = $existing->id;
            }
        }

        $keptPhotographyIds = [];
        foreach ($validated['photographies'] as $index => $row) {
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

            if ($request->hasFile("photographies.{$index}.image")) {
                $path = $request->file("photographies.{$index}.image")->store('photographies', 'public');
                $data['image'] = '/storage/' . $path;
            }

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Photography::create($data);
                $keptPhotographyIds[] = $new->id;
            } else {
                $existing = Photography::query()->findOrFail($id);
                if (isset($data['image']) && $existing->image && str_starts_with($existing->image, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $existing->image));
                }
                $existing->update($data);
                $keptPhotographyIds[] = $existing->id;
            }
        }

        Design::query()->whereNotIn('id', $keptDesignIds)->delete();
        Photography::query()->whereNotIn('id', $keptPhotographyIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Design & Photography updated successfully.']);
        return back();
    }
}
