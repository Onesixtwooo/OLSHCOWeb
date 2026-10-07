<?php

namespace App\Http\Middleware;

use App\Models\PageSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        $content = PageSetting::query()->where('key', 'homepage')->value('value');
        $maintenance = $content['settings']['maintenance'] ?? [];

        if (($maintenance['enabled'] ?? false) === true) {
            return response()
                ->view('maintenance', ['maintenance' => $maintenance], 503)
                ->header('Retry-After', '3600')
                ->header('Cache-Control', 'no-store, private')
                ->header('X-Robots-Tag', 'noindex');
        }

        return $next($request);
    }
}
