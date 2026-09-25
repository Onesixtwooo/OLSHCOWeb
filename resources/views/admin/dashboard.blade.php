<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Homepage editor · OLSHCO</title>
    @viteReactRefresh
    @vite(['resources/js/admin.jsx'])
</head>
<body>
    <div id="admin-app"></div>
    <script>window.__OLSHCO_ADMIN_CONTENT__ = {{ Illuminate\Support\Js::from($savedContent) }};</script>
</body>
</html>
