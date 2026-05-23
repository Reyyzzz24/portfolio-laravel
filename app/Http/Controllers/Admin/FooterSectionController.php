<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FooterSectionController extends Controller
{
    public function edit(): Response
    {
        $footers = Footer::query()->orderBy('display_order')->get();

        return Inertia::render('admin/footer', [
            'footers' => $footers->map(fn(Footer $f) => [
                'id' => $f->id,
                'copyright' => $f->copyright,
                'name' => $f->name,
                'url' => $f->url,
                'icon_path' => $f->icon_path,
                'hover_class' => $f->hover_class,
                'display_order' => $f->display_order,
            ])->values()->all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'footers' => ['required', 'array'],
            'footers.*.id' => ['nullable'],
            'footers.*.copyright' => ['nullable', 'string', 'max:255'],
            'footers.*.name' => ['required', 'string', 'max:255'],
            'footers.*.url' => ['required', 'string', 'max:255'],
            'footers.*.icon_path' => ['nullable', 'string'],
            'footers.*.hover_class' => ['nullable', 'string', 'max:255'],
            'footers.*.display_order' => ['nullable', 'integer'],
        ]);

        $rows = $validated['footers'];
        $keptIds = [];

        foreach ($rows as $index => $row) {
            $id = $row['id'] ?? null;
            $data = [
                'copyright' => $row['copyright'] ?? null,
                'name' => $row['name'] ?? '',
                'url' => $row['url'] ?? '',
                'icon_path' => $row['icon_path'] ?? $row['iconPath'] ?? '',
                'hover_class' => $row['hover_class'] ?? $row['hoverClass'] ?? '',
                'display_order' => $row['display_order'] ?? ($index + 1),
            ];

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Footer::create($data);
                $keptIds[] = $new->id;
            } elseif ($id && Footer::query()->where('id', $id)->exists()) {
                Footer::query()->find($id)->update($data);
                $keptIds[] = $id;
            } else {
                $new = Footer::create($data);
                $keptIds[] = $new->id;
            }
        }

        Footer::query()->whereNotIn('id', $keptIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Footer updated.']);
        return back();
    }
}
