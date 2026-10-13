<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuditAndUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_actions_are_recorded_and_visible_to_admins(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->postJson('/admin/users', [
            'name' => 'Editor',
            'email' => 'editor@example.com',
            'role' => 'editor',
            'password' => 'a-secure-password',
            'password_confirmation' => 'a-secure-password',
        ])->assertCreated();

        $this->assertDatabaseHas('audit_logs', ['action' => 'user.created', 'user_id' => $admin->id]);
        $this->actingAs($admin)->getJson('/admin/audit-logs')->assertOk()->assertJsonPath('logs.0.action', 'user.created');
    }

    public function test_uploads_require_verified_content_types_and_use_generated_names(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/uploads/program-image', [
            'image' => UploadedFile::fake()->image('original.jpg', 100, 100),
        ]);

        $response->assertOk();
        $path = parse_url($response->json('url'), PHP_URL_PATH);
        $this->assertStringNotContainsString('original', $path);
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $path));
        $this->assertDatabaseHas('audit_logs', ['action' => 'upload.program_image']);
    }

    public function test_non_image_content_is_rejected(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post('/admin/uploads/program-image', [
            'image' => UploadedFile::fake()->create('payload.jpg', 10, 'text/plain'),
        ])->assertSessionHasErrors('image');

        $this->assertDatabaseMissing('audit_logs', ['action' => 'upload.program_image']);
    }
}
