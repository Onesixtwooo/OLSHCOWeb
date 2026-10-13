<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'users' => User::query()->latest()->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'editor'])],
            'password' => ['required', 'string', 'min:10', 'confirmed'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
        ]);
        AuditLog::record('user.created', $user, ['role' => $user->role]);

        return response()->json(['user' => $user->only(['id', 'name', 'email', 'role', 'created_at'])], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'editor'])],
            'password' => ['nullable', 'string', 'min:10', 'confirmed'],
        ]);

        if ($user->isAdmin() && $validated['role'] !== 'admin' && User::query()->where('role', 'admin')->count() === 1) {
            return response()->json(['message' => 'At least one administrator account must remain.'], 422);
        }

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);
        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->session_version++;
        $user->remember_token = Str::random(60);
        $user->save();
        AuditLog::record('user.updated', $user, ['role' => $user->role, 'password_changed' => ! empty($validated['password'])]);

        return response()->json(['user' => $user->only(['id', 'name', 'email', 'role', 'created_at'])]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorizeAdmin($request);

        if ($user->is($request->user())) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }
        if ($user->isAdmin() && User::query()->where('role', 'admin')->count() === 1) {
            return response()->json(['message' => 'At least one administrator account must remain.'], 422);
        }

        $user->delete();
        AuditLog::record('user.deleted', $user, ['email' => $user->email]);

        return response()->json(['message' => 'User deleted.']);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->isAdmin(), 403);
    }
}
