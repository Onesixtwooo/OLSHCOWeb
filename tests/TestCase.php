<?php

namespace Tests;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function actingAs(Authenticatable $user, $guard = null)
    {
        if ($user instanceof User) {
            $this->withSession(['auth_session_version' => $user->refresh()->session_version]);
        }

        return parent::actingAs($user, $guard);
    }
}
