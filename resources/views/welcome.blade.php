<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Our Lady of the Sacred Heart College — A Catholic school community nurturing faith, inspiring excellence, and building compassionate leaders. Enroll now for Elementary, Junior High, and Senior High School.">
    <meta name="keywords" content="OLSHCO, Catholic school, Sacred Heart, education, enrollment, elementary, high school, senior high, Philippines">

    <title>{{ $pageTitle ?? 'OLSHCO ? Our Lady of the Sacred Heart College' }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/images/logo.png">

    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
    <script>window.__OLSHCO_PUBLIC_CONTENT__ = {{ Illuminate\Support\Js::from($savedContent ?? []) }};</script>
</body>
</html>
