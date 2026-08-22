<!DOCTYPE html>
<html lang="{{ $language }}" dir="{{ $language === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <title>{{ $copy['title'] }}</title>
</head>
<body dir="{{ $language === 'ar' ? 'rtl' : 'ltr' }}" style="font-family: Arial, sans-serif; color: #292524; line-height: 1.6; direction: {{ $language === 'ar' ? 'rtl' : 'ltr' }}; text-align: {{ $language === 'ar' ? 'right' : 'left' }};">
    <h1 style="font-size: 22px;">{{ $copy['title'] }}</h1>

    <p>{{ $copy['hello'] }} {{ $customerName ?: $copy['customer'] }}{{ $language === 'ar' ? '،' : ',' }}</p>

    <p>
        {{ $copy['confirmed'] }}
        <strong>#{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</strong>.
        {{ $copy['preparing'] }}
    </p>

    <h2 style="font-size: 17px;">{{ $copy['details'] }}</h2>
    <table dir="{{ $language === 'ar' ? 'rtl' : 'ltr' }}" style="width: 100%; border-collapse: collapse; direction: {{ $language === 'ar' ? 'rtl' : 'ltr' }};">
        <thead>
            <tr>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1;">{{ $copy['product'] }}</th>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1;">{{ $copy['quantity'] }}</th>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1;">{{ $copy['price'] }}</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($purchases as $purchase)
                @php
                    $product = $purchase['product'] ?? [];
                    $name = $product['name'][$language]
                        ?? $product['name']['fr']
                        ?? $product['name']['en']
                        ?? $copy['product'];
                    $quantity = $purchase['quantity'] ?? 0;
                    $unitPrice = !empty($product['is_discount'])
                        ? ($product['price_after_discount'] ?? $product['price'] ?? 0)
                        : ($product['price'] ?? 0);
                @endphp
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">{{ $name }}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: right;">{{ $quantity }}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: right;">
                        {{ number_format((float) $unitPrice * (float) $quantity, 2, ',', ' ') }} {{ $copy['currency'] }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 18px;">
        <strong>{{ $copy['subtotal'] }} :</strong> {{ number_format((float) $order->subTotal, 2, ',', ' ') }} {{ $copy['currency'] }}<br>
        <strong>{{ $copy['delivery'] }} :</strong> {{ number_format((float) $order->delivery, 2, ',', ' ') }} {{ $copy['currency'] }}<br>
        <strong>{{ $copy['total'] }} :</strong> {{ number_format((float) $order->total, 2, ',', ' ') }} {{ $copy['currency'] }}<br>
        <strong>{{ $copy['payment'] }} :</strong> {{ $order->cutlery ? $copy['meal_voucher'] : $copy['cash_delivery'] }}
    </p>

    @if ($order->message)
        <p><strong>{{ $copy['comment'] }} :</strong> {{ $order->message }}</p>
    @endif

    <p>{{ $copy['updates'] }}</p>

    <p>
        {{ $copy['thanks'] }}<br>
        {{ $copy['team'] }}
    </p>
</body>
</html>
