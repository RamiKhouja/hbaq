<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/ico" href="/pictures/favicon-light.ico" media="(prefers-color-scheme: light)"/>
        <link rel="icon" type="image/ico" href="/pictures/favicon-dark.ico" media="(prefers-color-scheme: dark)"/>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo&display=swap" rel="stylesheet">
        <!-- Scripts -->
        <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
    <!-- ¯\_(ツ)_/¯
    Developed by Rami Khouja
    Innovega © 2025 -->
</html>
