<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactSectionController extends Controller
{
    public function edit(): Response
    {
        $contacts = Contact::query()->orderBy('display_order')->get();
        $section = ContactSection::query()->first();

        return Inertia::render('admin/contact', [
            'section' => $section ? $section->toArray() : null,
            'contacts' => $contacts->map(fn(Contact $c) => [
                'id' => $c->id,
                'label' => $c->label,
                'value' => $c->value,
                'href' => $c->href,
                'icon_path' => $c->icon_path,
                'display_order' => $c->display_order,
            ])->values()->all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section' => ['nullable', 'array'],
            'section.section_eyebrow' => ['nullable', 'string', 'max:255'],
            'section.section_title' => ['nullable', 'string', 'max:255'],
            'section.form_action' => ['nullable', 'string', 'max:255'],
            'section.submit_label' => ['nullable', 'string', 'max:255'],
            'contacts' => ['required', 'array'],
            'contacts.*.id' => ['nullable'],
            'contacts.*.label' => ['required', 'string', 'max:255'],
            'contacts.*.value' => ['required', 'string'],
            'contacts.*.href' => ['nullable', 'string', 'max:255'],
            'contacts.*.icon_path' => ['nullable', 'string'],
            'contacts.*.display_order' => ['nullable', 'integer'],
        ]);

        $sectionData = $validated['section'] ?? null;
        if ($sectionData) {
            $sec = ContactSection::query()->first();
            if ($sec) {
                $sec->update($sectionData);
            } else {
                ContactSection::create($sectionData);
            }
        }

        $rows = $validated['contacts'];
        $keptIds = [];

        foreach ($rows as $index => $row) {
            $id = $row['id'] ?? null;

            $data = [
                'label' => $row['label'],
                'value' => $row['value'],
                'href' => $row['href'] ?? null,
                'icon_path' => $row['icon_path'] ?? $row['iconPath'] ?? '',
                'display_order' => $row['display_order'] ?? ($index + 1),
            ];

            if ($id && !str_starts_with((string)$id, 'new_') && Contact::query()->where('id', $id)->exists()) {
                Contact::query()->find($id)->update($data);
                $keptIds[] = $id;
            } else {
                $new = Contact::create($data);
                $keptIds[] = $new->id;
            }
        }

        Contact::query()->whereNotIn('id', $keptIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Contact section updated.']);
        return back();
    }
}
