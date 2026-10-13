<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountInvitation extends Notification
{
    use Queueable;

    public function __construct(public readonly string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = route('admin.password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);
        $role = $notifiable->isAdmin() ? 'administrator' : 'editor';
        $minutes = config('auth.passwords.users.expire');

        return (new MailMessage)
            ->subject('Set up your OLSHCO account')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('An OLSHCO '.$role.' account has been created for you.')
            ->line('Use the link below to set your password and activate your account.')
            ->action('Set your password', $url)
            ->line("This link expires in {$minutes} minutes. If you did not expect this invitation, you can ignore this email.");
    }
}
