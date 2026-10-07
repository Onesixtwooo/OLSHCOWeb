<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Website maintenance | OLSHCO</title>
    <link rel="icon" type="image/png" href="/images/logo.png">
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #172554; background: radial-gradient(circle at 80% 12%, #dbeafe 0, transparent 32%), linear-gradient(145deg, #f8fbff, #eaf2ff); }
        .page { min-height: 100vh; display: grid; place-items: center; padding: 32px 20px; }
        .card { width: min(100%, 680px); padding: clamp(32px, 6vw, 64px); border: 1px solid #dbe7f8; border-radius: 28px; background: #fff; box-shadow: 0 24px 70px rgba(23, 37, 84, .10); text-align: center; }
        .logo { display: block; width: 82px; height: 82px; object-fit: contain; margin: 0 auto 26px; }
        .eyebrow { color: #2563eb; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
        h1 { margin: 14px 0 18px; font-size: clamp(32px, 6vw, 52px); line-height: 1.12; letter-spacing: -.045em; }
        p { margin: 0 auto; max-width: 520px; color: #526581; font-size: clamp(15px, 2.2vw, 18px); line-height: 1.7; white-space: pre-line; }
        .rule { width: 64px; height: 4px; border-radius: 4px; background: #2563eb; margin: 32px auto 0; }
        .brand { margin-top: 28px; color: #71819c; font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
    </style>
</head>
<body>
    <main class="page">
        <section class="card" aria-labelledby="maintenance-title">
            <img class="logo" src="/images/logo.png" alt="OLSHCO logo">
            <div class="eyebrow">Website maintenance</div>
            <h1 id="maintenance-title">{{ ($maintenance['title'] ?? '') ?: 'We will be back soon' }}</h1>
            <p>{{ ($maintenance['message'] ?? '') ?: 'Our website is temporarily unavailable while we make improvements. Please check back shortly.' }}</p>
            <div class="rule" aria-hidden="true"></div>
            <div class="brand">Our Lady of the Sacred Heart College of Guimba</div>
        </section>
    </main>
</body>
</html>
