<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ResumeSection;
use App\Models\Skill;
use App\Models\Education;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillsEducationController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/skills-educations', [
            'section' => ResumeSection::first(),
            'skills' => Skill::orderBy('display_order')->get(),
            'education' => Education::orderBy('display_order')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_eyebrow' => ['required', 'string', 'max:255'],
            'section_title' => ['required', 'string', 'max:255'],
            'section_description' => ['required', 'string'],

            'skills' => ['nullable', 'array'],
            'skills.*.id' => ['required'],
            'skills.*.name' => ['required', 'string', 'max:255'],
            'skills.*.display_order' => ['required', 'integer', 'min:0'],

            'education' => ['nullable', 'array'],
            'education.*.id' => ['required'],
            'education.*.institution' => ['required', 'string', 'max:255'],
            'education.*.degree' => ['required', 'string', 'max:255'],
            'education.*.period' => ['required', 'string', 'max:255'],
            'education.*.is_current' => ['required', 'boolean'],
            'education.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        // update shared resume section
        ResumeSection::updateOrCreate(['id' => 1], [
            'section_eyebrow' => $validated['section_eyebrow'],
            'section_title' => $validated['section_title'],
            'section_description' => $validated['section_description'],
        ]);

        // sync skills
        $keptSkills = [];
        foreach ($validated['skills'] ?? [] as $row) {
            $id = $row['id'];
            unset($row['id']);
            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Skill::create($row);
                $keptSkills[] = $new->id;
            } else {
                $existing = Skill::findOrFail($id);
                $existing->update($row);
                $keptSkills[] = $existing->id;
            }
        }
        Skill::query()->whereNotIn('id', $keptSkills)->delete();

        // sync education
        $keptEdu = [];
        foreach ($validated['education'] ?? [] as $row) {
            $id = $row['id'];
            unset($row['id']);
            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Education::create($row);
                $keptEdu[] = $new->id;
            } else {
                $existing = Education::findOrFail($id);
                $existing->update($row);
                $keptEdu[] = $existing->id;
            }
        }
        Education::query()->whereNotIn('id', $keptEdu)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Skills & Education updated.']);
        return back();
    }
}
