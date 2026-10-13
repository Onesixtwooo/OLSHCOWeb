<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProvisioningTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_setup_route_is_removed(): void
    {
        $this->get('/admin/setup')->assertNotFound();
    }

    public function test_admin_can_be_created_from_the_artisan_command(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'Site Administrator',
            '--email' => 'admin@example.com',
            '--password' => 'a-secure-password',
        ])->assertExitCode(0);

        $this->assertDatabaseHas('users', [
            'name' => 'Site Administrator',
            'email' => 'admin@example.com',
        ]);

        $this->assertTrue(password_verify('a-secure-password', User::query()->firstOrFail()->password));
    }
}
