<?php

namespace Tests\Feature;

use App\Models\PageSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServicesTest extends TestCase
{
    use RefreshDatabase;

    public function test_services_page_loads_without_saved_content(): void
    {
        $this->get('/services')->assertOk()->assertSee('Office Services | OLSHCO');
    }

    public function test_office_details_can_be_saved_and_loaded(): void
    {
        $content = ['services' => ['title' => 'Services Offered', 'offices' => [
            ['name' => 'Guidance Office', 'personInCharge' => 'Office coordinator', 'location' => 'Room 2', 'officeHours' => 'Monday', 'contact' => 'Office extension 10', 'description' => '', 'image' => ''],
        ]]];

        $this->actingAs(User::factory()->create());
        $this->get('/admin/services/edit')->assertOk();
        $this->putJson('/admin/content', ['content' => $content])->assertOk();
        $stored = $content;
        $stored['services']['offices'][0]['description'] = null;
        $stored['services']['offices'][0]['image'] = null;
        $this->assertSame($stored, PageSetting::where('key', 'homepage')->first()->value);
        $this->getJson('/homepage-content')->assertJsonPath('services.offices.0.location', 'Room 2');
        $this->get('/services')->assertOk()->assertViewHas('savedContent', $content);
        $this->get('/services/guidance-office')->assertOk()->assertViewHas('savedContent', $content);

        $content['services']['offices'] = [];
        $this->putJson('/admin/content', ['content' => $content])->assertOk();
        $this->getJson('/homepage-content')->assertJsonPath('services.offices', []);
    }

    public function test_guests_cannot_edit_offices(): void
    {
        $this->putJson('/admin/content', ['content' => ['services' => []]])->assertUnauthorized();
    }
}
