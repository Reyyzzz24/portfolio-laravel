<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResumeSection;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/skills', [
            'section' => ResumeSection::first(),
            'skills' => Skill::orderBy('display_order')->get()
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_eyebrow' => ['required', 'string', 'max:255'],
            'section_title' => ['required', 'string', 'max:255'],
            'section_description' => ['required', 'string'],
            'skills' => ['array'],
            'skills.*.id' => ['required'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        ResumeSection::updateOrCreate(['id' => 1], [
            'section_eyebrow' => $validated['section_eyebrow'],
            'section_title' => $validated['section_title'],
            'section_description' => $validated['section_description'],
        ]);

        $keptIds = [];
        foreach ($validated['skills'] ?? [] as $row) {
            $id = $row['id'];
            unset($row['id']);

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $newRecord = Skill::create($row);
                $keptIds[] = $newRecord->id;
            } else {
                $existing = Skill::findOrFail($id);
                $existing->update($row);
                $keptIds[] = $existing->id;
            }
        }

            Skill::query()->whereNotIn('id', $keptIds)->delete();
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Skills data synchronized successfully.']);
            return back();
    }
}