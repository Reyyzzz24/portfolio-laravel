<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResumeSection;
use App\Models\Education;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EducationSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/education', [
            'section' => ResumeSection::first(),
            'education' => Education::orderBy('display_order')->get()
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_eyebrow' => ['required', 'string', 'max:255'],
            'section_title' => ['required', 'string', 'max:255'],
            'section_description' => ['required', 'string'],
            'education' => ['array'],
            'education.*.id' => ['required'],
            'education.*.institution' => ['required', 'string', 'max:255'],
            'education.*.degree' => ['required', 'string', 'max:255'],
            'education.*.period' => ['required', 'string', 'max:255'],
            'education.*.is_current' => ['required', 'boolean'],
            'education.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        ResumeSection::updateOrCreate(['id' => 1], [
            'section_eyebrow' => $validated['section_eyebrow'],
            'section_title' => $validated['section_title'],
            'section_description' => $validated['section_description'],
        ]);

        $keptIds = [];
        foreach ($validated['education'] ?? [] as $row) {
            $id = $row['id'];
            unset($row['id']);

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $newRecord = Education::create($row);
                $keptIds[] = $newRecord->id;
            } else {
                $existing = Education::findOrFail($id);
                $existing->update($row);
                $keptIds[] = $existing->id;
            }
        }

            Education::query()->whereNotIn('id', $keptIds)->delete();
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Education data synchronized successfully.']);
            return back();
    }
}