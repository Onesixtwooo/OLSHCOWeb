<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()?->isAdmin(), 403);

        $logs = AuditLog::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (AuditLog $log): array => [
                'id' => $log->id,
                'action' => $log->action,
                'target' => $log->target_type ? class_basename($log->target_type).' #'.$log->target_id : null,
                'metadata' => $log->metadata,
                'user' => $log->user?->name ?? 'System / unknown',
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at?->toIso8601String(),
            ]);

        return response()->json(['logs' => $logs]);
    }
}
