<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/user', [
            'users' => User::orderBy('id')->get(),
            'roles' => Role::orderBy('id')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'users' => ['required', 'array'],
            'users.*.id' => ['required', 'integer'],
            'users.*.role_id' => ['nullable', 'integer', 'exists:roles,id'],
        ]);

        foreach ($validated['users'] as $row) {
            $user = User::findOrFail($row['id']);
            $user->role_id = $row['role_id'] ?? null;
            $user->save();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Users updated']);
        return back();
    }
}
