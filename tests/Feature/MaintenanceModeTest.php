<?php

namespace Tests\Feature;

use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaintenanceModeTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_remain_available_when_maintenance_is_disabled(): void
    {
        $this->get('/')->assertOk();
        $this->get('/services')->assertOk();
        $this->get('/maintenance')->assertOk()->assertSee('We will be back soon');
    }

    public function test_maintenance_blocks_public_routes_but_keeps_admin_accessible(): void
    {
        PageSetting::query()->create(['key' => 'homepage', 'value' => [
            'settings' => ['maintenance' => [
                'enabled' => true,
                'title' => 'Updates in progress',
                'message' => 'Please return tomorrow.',
            ]],
        ]]);

        foreach (['/', '/about', '/services', '/services/guidance', '/faculty-staff', '/homepage-content'] as $path) {
            $this->get($path)->assertStatus(503)->assertSee('Updates in progress')->assertSee('Please return tomorrow.');
        }

        $this->post('/contact/messages', [])->assertStatus(503);
        $admin = User::factory()->create();
        $this->get('/admin/login')->assertOk();
        $this->actingAs($admin)->get('/admin/settings/edit')->assertOk();
    }

    public function test_admin_can_save_and_disable_maintenance_mode(): void
    {
        $this->actingAs(User::factory()->create());
        PageSetting::query()->create(['key' => 'homepage', 'value' => ['site' => ['brand' => 'OLSHCO']]]);
        $maintenance = [
            'enabled' => true,
            'title' => 'Scheduled maintenance',
            'message' => 'Please check back later.',
        ];

        $this->putJson('/admin/settings/maintenance', $maintenance)
            ->assertOk()
            ->assertJsonPath('maintenance.enabled', true);
        $this->assertTrue(PageSetting::query()->where('key', 'homepage')->first()->value['settings']['maintenance']['enabled']);
        $this->assertSame('OLSHCO', PageSetting::query()->where('key', 'homepage')->first()->value['site']['brand']);
        $this->get('/admin/settings/edit')->assertOk()->assertViewHas('savedContent', function ($content) {
            return $content['settings']['maintenance']['title'] === 'Scheduled maintenance';
        });
        $this->get('/')->assertStatus(503)->assertSee('Scheduled maintenance');

        $maintenance['enabled'] = false;
        $this->putJson('/admin/settings/maintenance', $maintenance)->assertOk();
        $this->get('/')->assertOk();
    }

    public function test_guest_cannot_change_maintenance_mode(): void
    {
        $this->putJson('/admin/settings/maintenance', [
            'enabled' => true,
            'title' => 'Unavailable',
            'message' => 'Back soon',
        ])->assertUnauthorized();
    }
}
