<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\AccountInvitation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_an_editor(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'Content Editor',
            'email' => 'editor@example.com',
            'role' => 'editor',
        ]);

        $response->assertCreated()->assertJsonPath('message', 'Invitation sent.');
        $this->assertDatabaseHas('users', ['email' => 'editor@example.com', 'role' => 'editor']);
        $editor = User::query()->where('email', 'editor@example.com')->firstOrFail();
        Notification::assertSentTo($editor, AccountInvitation::class, function (AccountInvitation $notification) use ($editor): bool {
            return Password::broker()->tokenExists($editor, $notification->token)
                && str_contains($notification->toMail($editor)->actionUrl, '/admin/reset-password/');
        });
        $this->assertFalse(Hash::check('password', $editor->password));
    }

    public function test_invited_user_can_set_password_and_verify_email(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'New Editor',
            'email' => 'new-editor@example.com',
            'role' => 'editor',
        ])->assertCreated();

        $editor = User::query()->where('email', 'new-editor@example.com')->firstOrFail();
        $this->assertNull($editor->email_verified_at);
        $token = null;
        Notification::assertSentTo($editor, AccountInvitation::class, function (AccountInvitation $notification) use (&$token): bool {
            $token = $notification->token;

            return true;
        });

        $this->post('/admin/reset-password', [
            'token' => $token,
            'email' => $editor->email,
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertRedirect('/admin/login');

        $editor->refresh();
        $this->assertTrue(Hash::check('new-secure-password', $editor->password));
        $this->assertNotNull($editor->email_verified_at);
        $this->assertFalse(Password::broker()->tokenExists($editor, $token));
    }

    public function test_failed_invitation_delivery_does_not_leave_an_account(): void
    {
        Notification::shouldReceive('send')->once()->andThrow(new \RuntimeException('Mail unavailable'));
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'New Editor',
            'email' => 'new-editor@example.com',
            'role' => 'editor',
        ])->assertStatus(503);

        $this->assertDatabaseMissing('users', ['email' => 'new-editor@example.com']);
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => 'new-editor@example.com']);
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
