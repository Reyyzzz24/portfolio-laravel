<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdminRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user) {
            abort(403);
        }

        $roleName = optional($user->role)->name;
        if (!in_array($roleName, ['superadmin', 'admin'])) {
            abort(403);
        }

        return $next($request);
    }
}
