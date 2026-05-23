<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/projects', [
            'section' => ProjectSection::query()->first(), // Mengambil data header
            'projects' => Project::query()->orderBy('display_order')->get()
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section' => ['required', 'array'],
            'section.section_eyebrow' => ['required', 'string', 'max:255'],
            'section.section_title' => ['required', 'string', 'max:255'],
            'projects' => ['required', 'array'],
            'projects.*.id' => ['required'],
            'projects.*.title' => ['required', 'string', 'max:255'],
            'projects.*.image' => ['nullable'],
            'projects.*.image_alt' => ['required_with:projects.*.image', 'nullable', 'string', 'max:255'],
            'projects.*.tags' => ['required', 'string', 'max:255'],
            'projects.*.description' => ['required', 'string'],
            'projects.*.link' => ['required', 'string', 'max:255'],
            'projects.*.is_external' => ['required', 'boolean'],
            'projects.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        // 1. Update Header
        ProjectSection::updateOrCreate(['id' => 1], $validated['section']);

        // 2. Update Items
        $keptIds = [];
        foreach ($validated['projects'] as $index => $row) {
            $id = $row['id'];

            // Ekstraksi data secara eksplisit (Paling aman untuk mass assignment)
            $data = [
                'title' => $row['title'],
                'image_alt' => $row['image_alt'] ?? null,
                'tags' => $row['tags'],
                'description' => $row['description'],
                'link' => $row['link'],
                'is_external' => (bool)$row['is_external'],
                'display_order' => (int)$row['display_order'],
            ];

            // Penanganan file upload terpisah
            if ($request->hasFile("projects.{$index}.image")) {
                $path = $request->file("projects.{$index}.image")->store('portfolios', 'public');
                $data['image'] = '/storage/' . $path;
            }

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $newRecord = Project::create($data);
                $keptIds[] = $newRecord->id;
            } else {
                $existingRecord = Project::query()->findOrFail($id);
                // Hapus gambar lama jika ada pergantian
                if (isset($data['image']) && $existingRecord->image && str_starts_with($existingRecord->image, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $existingRecord->image));
                }
                $existingRecord->update($data);
                $keptIds[] = $id;
            }
        }

        Project::query()->whereNotIn('id', $keptIds)->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Projects section updated successfully.']);
        return back();
    }
}
