<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $mode === 'setup' ? 'Create administrator' : 'Admin sign in' }} · OLSHCO</title>
    <style>
        *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 15% 10%,#dbeafe,transparent 32%),#f7faff;color:#172554;font-family:Inter,system-ui,sans-serif}.card{width:min(100%,440px);padding:38px;border:1px solid #dbeafe;border-radius:28px;background:rgba(255,255,255,.95);box-shadow:0 24px 60px rgba(30,58,138,.13)}.brand{display:flex;align-items:center;gap:12px;margin-bottom:28px;font-weight:800;font-size:20px}.brand img{width:48px;height:48px;object-fit:contain}.eyebrow{color:#2563eb;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}h1{margin:8px 0 8px;font-size:32px;letter-spacing:-.04em}p{margin:0 0 28px;color:#64748b;line-height:1.55}label{display:block;margin:16px 0 6px;color:#334155;font-size:14px;font-weight:700}input{width:100%;height:48px;padding:0 14px;border:1px solid #cbd5e1;border-radius:11px;background:#f8fafc;font:inherit;outline:none}input:focus{border-color:#3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,.12)}button{width:100%;height:50px;margin-top:24px;border:0;border-radius:999px;background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:white;font:inherit;font-weight:800;cursor:pointer}.remember{display:flex;align-items:center;gap:8px}.remember input{width:16px;height:16px}.errors{padding:12px 14px;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:14px}.hint{margin-top:18px;text-align:center;font-size:12px;color:#94a3b8}
    </style>
</head>
<body>
<main class="card">
    <div class="brand"><img src="/images/logo.png" alt="OLSHCO logo"> OLSHCO Admin</div>
    <div class="eyebrow">{{ $mode === 'setup' ? 'First-time setup' : 'Secure access' }}</div>
    <h1>{{ $mode === 'setup' ? 'Create administrator' : 'Welcome back' }}</h1>
    <p>{{ $mode === 'setup' ? 'Create the first account that can manage the public homepage.' : 'Sign in to edit and publish homepage content.' }}</p>

    @if ($errors->any())
        <div class="errors">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ $mode === 'setup' ? route('admin.setup') : route('admin.login') }}">
        @csrf
        @if ($mode === 'setup')
            <label for="name">Name</label>
            <input id="name" name="name" value="{{ old('name') }}" required autocomplete="name">
        @endif
        <label for="email">Email address</label>
        <input id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email">
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required autocomplete="{{ $mode === 'setup' ? 'new-password' : 'current-password' }}">
        @if ($mode === 'setup')
            <label for="password_confirmation">Confirm password</label>
            <input id="password_confirmation" name="password_confirmation" type="password" required autocomplete="new-password">
        @else
            <label class="remember"><input name="remember" type="checkbox" value="1"> Keep me signed in</label>
        @endif
        <button type="submit">{{ $mode === 'setup' ? 'Create admin account' : 'Sign in' }}</button>
    </form>
    <div class="hint">Protected by Laravel session authentication</div>
</main>
</body>
</html>
