<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceSectionController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/services', [
            'section' => ServiceSection::query()->first(), // Ambil header
            'services' => Service::query()->orderBy('display_order')->get()
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section' => ['required', 'array'],
            'section.section_eyebrow' => ['required', 'string', 'max:255'],
            'section.section_title' => ['required', 'string', 'max:255'],
            'services' => ['required', 'array'],
            'services.*.id' => ['required'],
            'services.*.title' => ['required', 'string', 'max:255'],
            'services.*.description' => ['required', 'string'],
            'services.*.color' => ['required', 'string', 'max:255'],
            'services.*.icon_path' => ['required', 'string'],
            'services.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        ServiceSection::updateOrCreate(['id' => 1], $validated['section']);

        $keptIds = [];
        foreach ($validated['services'] as $row) {
            $id = $row['id'];

            // Mapping eksplisit
            $data = [
                'title' => $row['title'],
                'description' => $row['description'],
                'color' => $row['color'],
                'icon_path' => $row['icon_path'],
                'display_order' => (int)$row['display_order'],
            ];

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $newRecord = Service::create($data);
                $keptIds[] = $newRecord->id;
            } else {
                Service::query()->findOrFail($id)->update($data);
                $keptIds[] = $id;
            }
        }

        Service::query()->whereNotIn('id', $keptIds)->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Services updated.']);
        return back();
    }
}
