<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Navbar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NavbarController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/navbar', [
            'navbars' => Navbar::orderBy('display_order')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'navbars' => ['required', 'array'],
            'navbars.*.id' => ['required'],
            'navbars.*.brand' => ['required', 'string', 'max:255'],
            'navbars.*.resume_label' => ['required', 'string', 'max:255'],
            'navbars.*.documents_label' => ['required', 'string', 'max:255'],
            'navbars.*.item_type' => ['required', 'string', 'in:link,resume'],
            'navbars.*.label' => ['required', 'string', 'max:255'],
            'navbars.*.href' => ['required', 'string', 'max:255'],
            'navbars.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        $keptIds = [];
        foreach ($validated['navbars'] as $index => $row) {
            $id = $row['id'];
            unset($row['id']);

            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Navbar::create($row);
                $keptIds[] = $new->id;
            } else {
                $existing = Navbar::findOrFail($id);
                $existing->update($row);
                $keptIds[] = $existing->id;
            }
        }

        Navbar::query()->whereNotIn('id', $keptIds)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Navbar menu synchronized successfully.']);
        return back();
    }
}
