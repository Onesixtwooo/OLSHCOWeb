<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Verify email · OLSHCO</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f7faff;color:#172554;font-family:Inter,system-ui,sans-serif}.card{width:min(100%,520px);padding:38px;border:1px solid #dbeafe;border-radius:28px;background:#fff;box-shadow:0 24px 60px #1e3a8a22}h1{margin:0 0 12px}p{color:#64748b;line-height:1.6}.status{padding:12px;border-radius:10px;background:#eff6ff;color:#1d4ed8}</style></head>
<body><main class="card"><h1>Check your email</h1><p>Follow the verification link sent to your administrator email address before signing in.</p>
@if (session('status'))
<p class="status">{{ session('status') }}</p>
@endif
<a href="{{ route('admin.login') }}">Return to sign in</a></main></body></html>
