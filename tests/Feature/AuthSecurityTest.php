<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_reset_pages_are_available(): void
    {
        $this->get('/admin/forgot-password')->assertOk();
        $this->get('/admin/reset-password/test-token')->assertOk();
    }

    public function test_changed_session_version_revokes_existing_session(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'session_version' => 2]);
        $this->actingAs($user)->withSession(['auth_session_version' => 1]);

        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_missing_session_version_is_rejected(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $this->actingAs($user)->withSession(['auth_session_version' => null]);

        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_valid_remember_cookie_can_start_a_new_session(): void
    {
        $user = User::factory()->create(['role' => 'admin'])->refresh();
        $guard = Auth::guard('web');
        $recaller = implode('|', [
            $user->id,
            $user->remember_token,
            $guard->hashPasswordForCookie($user->password),
        ]);

        $this->withCookie($guard->getRecallerName(), $recaller)
            ->get('/admin')
            ->assertOk();

        $this->assertSame($user->session_version, session('auth_session_version'));
    }

    public function test_user_update_revokes_sessions_and_remember_tokens(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $editor = User::factory()->create(['role' => 'editor', 'remember_token' => 'existing-remember-token']);

        $this->actingAs($admin)->putJson("/admin/users/{$editor->id}", [
            'name' => $editor->name,
            'email' => $editor->email,
            'role' => 'admin',
        ])->assertOk();

        $editor->refresh();
        $this->assertSame(2, $editor->session_version);
        $this->assertNotSame('existing-remember-token', $editor->remember_token);

        $this->actingAs($editor)->withSession(['auth_session_version' => 1]);
        $this->get('/admin')->assertRedirect('/admin/login');
    }

    public function test_email_verification_notice_is_available(): void
    {
        $this->get('/admin/email/verify')->assertOk();
    }

    public function test_email_verification_can_be_required_by_configuration(): void
    {
        Notification::fake();
        config(['auth.require_email_verification' => true]);
        $user = User::factory()->create(['email' => 'unverified@example.com', 'email_verified_at' => null]);

        $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect('/admin/email/verify');

        Notification::assertSentTo($user, VerifyEmail::class);
    }
}
