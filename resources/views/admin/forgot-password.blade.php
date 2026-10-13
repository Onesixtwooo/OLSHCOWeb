<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="csrf-token" content="{{ csrf_token() }}"><title>Reset password · OLSHCO</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f7faff;color:#172554;font-family:Inter,system-ui,sans-serif}.card{width:min(100%,440px);padding:38px;border:1px solid #dbeafe;border-radius:28px;background:#fff;box-shadow:0 24px 60px #1e3a8a22}h1{margin:0 0 10px}p{color:#64748b;line-height:1.55}label{display:block;margin:18px 0 7px;font-weight:700}input{width:100%;height:48px;padding:0 14px;border:1px solid #cbd5e1;border-radius:11px;font:inherit;box-sizing:border-box}button{width:100%;height:50px;margin-top:24px;border:0;border-radius:999px;background:#2563eb;color:#fff;font:inherit;font-weight:800}.errors{padding:12px;border-radius:10px;background:#fef2f2;color:#b91c1c}.hint{display:block;margin-top:18px;text-align:center;color:#64748b;font-size:13px}</style></head>
<body><main class="card"><h1>Reset your password</h1><p>Enter your administrator email and we will send a password reset link.</p>
@if ($errors->any())
<div class="errors">{{ $errors->first() }}</div>
@endif
@if (session('status'))
<p>{{ session('status') }}</p>
@endif
<form method="POST" action="{{ route('admin.password.email') }}">@csrf<label for="email">Email address</label><input id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email"><button type="submit">Email reset link</button></form><a class="hint" href="{{ route('admin.login') }}">Back to sign in</a></main></body></html>
