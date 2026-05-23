<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/role', [
            'roles' => Role::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*.id' => ['required'],
            'roles.*.name' => ['required', 'string', 'max:255'],
            'roles.*.display_name' => ['nullable', 'string', 'max:255'],
        ]);

        $kept = [];
        foreach ($validated['roles'] as $row) {
            $id = $row['id'];
            unset($row['id']);
            if (is_string($id) && str_starts_with($id, 'new_')) {
                $new = Role::create($row);
                $kept[] = $new->id;
            } else {
                $existing = Role::findOrFail($id);
                $existing->update($row);
                $kept[] = $existing->id;
            }
        }

        Role::query()->whereNotIn('id', $kept)->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Roles synchronized']);
        return back();
    }
}
