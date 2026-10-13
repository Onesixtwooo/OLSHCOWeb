<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create
                            {--name= : Administrator name}
                            {--email= : Administrator email address}
                            {--password= : Password (omit to enter it securely)}';

    protected $description = 'Create an administrator account from the server console';

    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Name');
        $email = $this->option('email') ?: $this->ask('Email address');
        $password = $this->option('password') ?: $this->secret('Password');
        $confirmation = $this->option('password') ? $password : $this->secret('Confirm password');

        $validator = Validator::make(
            compact('name', 'email', 'password', 'confirmation'),
            [
                'name' => ['required', 'string', 'max:120'],
                'email' => ['required', 'email', 'max:190', 'unique:users,email'],
                'password' => ['required', 'string', 'min:10'],
                'confirmation' => ['same:password'],
            ],
            ['confirmation.same' => 'The password confirmation does not match.'],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        User::query()->create([
            'name' => $name,
            'email' => $email,
            'role' => 'admin',
            'password' => Hash::make($password),
        ]);

        $this->info("Administrator {$email} created successfully.");

        return self::SUCCESS;
    }
}
