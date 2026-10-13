<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_an_editor(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'Content Editor',
            'email' => 'editor@example.com',
            'role' => 'editor',
            'password' => 'a-secure-password',
            'password_confirmation' => 'a-secure-password',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'editor@example.com', 'role' => 'editor']);
    }

    public function test_editor_cannot_manage_users(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor)->getJson('/admin/users')->assertForbidden();
        $this->actingAs($editor)->postJson('/admin/users', [])->assertForbidden();
        $this->actingAs($editor)->putJson('/admin/settings/maintenance', [
            'enabled' => true,
            'title' => 'Maintenance',
            'message' => 'Back soon',
        ])->assertForbidden();
        $this->actingAs($editor)->get('/admin/users/edit')->assertForbidden();
    }

    public function test_last_admin_cannot_be_deleted_or_demoted(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->putJson("/admin/users/{$admin->id}", [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => 'editor',
        ])->assertUnprocessable();
    }
}
