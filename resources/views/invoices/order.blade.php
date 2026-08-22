<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Facture commande #{{ $order->id }}</title>
    <style>
        @page { margin: 28px 38px; }
        body { font-family: DejaVu Sans, sans-serif; color: #292524; font-size: 12px; }
        .logo { text-align: center; margin-bottom: 14px; }
        .logo img { width: 145px; height: auto; }
        .header { width: 100%; margin-bottom: 22px; }
        .header td { width: 50%; vertical-align: top; }
        .seller { text-align: right; }
        .box-title { color: #78716c; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .identity { font-size: 12px; line-height: 1.55; }
        h1 { color: #4a3327; font-size: 25px; text-align: center; margin: 8px 0 18px; }
        .meta { width: 100%; margin-bottom: 18px; border-collapse: collapse; }
        .meta td { padding: 7px 9px; border: 1px solid #d6d3d1; }
        .items { width: 100%; border-collapse: collapse; }
        .items th { padding: 9px 7px; color: white; background: #2E7D32; text-align: left; }
        .items th.number, .items td.number { text-align: right; }
        .items td { padding: 9px 7px; border-bottom: 1px solid #e7e5e4; }
        .totals { width: 42%; margin-left: auto; margin-top: 15px; border-collapse: collapse; }
        .totals td { padding: 6px 7px; }
        .totals td:last-child { text-align: right; font-weight: bold; }
        .tax-start td { padding-top: 14px; }
        .grand-total td { border-top: 2px solid #6f4e37; font-size: 14px; color: #4a3327; }
        .note { margin-top: 20px; padding: 10px; background: #fafaf9; }
        .footer { position: fixed; bottom: 0; width: 100%; color: #78716c; text-align: center; font-size: 9px; }
        .approval { width: 100%; margin-top: 24px; }
        .approval td { text-align: right; }
        .seal-composite { position: relative; display: inline-block; width: 76mm; min-height: 24mm; }
        .stamp-image { position: absolute; top: 0; right: 0; width: 58mm; height: auto; }
        .signature-image { position: absolute; top: 3mm; left: 4mm; width: 32mm; height: auto; }
    </style>
</head>
<body>
    @if ($logo)
        <div class="logo"><img src="{{ $logo }}" alt="Hbaq"></div>
    @endif

    <table class="header">
        <tr>
            <td>
                <div class="box-title">Facturé à</div>
                <div class="identity">
                    <strong>{{ $client['name'] ?: 'Client' }}</strong><br>
                    {{ $client['type'] }}<br>
                    @if ($client['mf']) Matricule fiscal : {{ $client['mf'] }}<br> @endif
                    @if ($client['email']) E-mail : {{ $client['email'] }}<br> @endif
                    @if ($client['phone']) Téléphone : {{ $client['phone'] }}<br> @endif
                    @if ($client['address']) Adresse : {{ $client['address'] }} @endif
                </div>
            </td>
            <td class="seller">
                <div class="box-title">Émetteur</div>
                <div class="identity">
                    <strong>Nom : {{ $seller['name'] }}</strong><br>
                    Matricule fiscal : {{ $seller['mf'] }}<br>
                    Adresse : {{ $seller['address'] }}<br>
                    @if ($seller['phone']) Téléphone : {{ $seller['phone'] }}<br> @endif
                    @if ($seller['email']) E-mail : {{ $seller['email'] }}<br> @endif
                    @if ($seller['vat_rate'] !== null) TVA : {{ rtrim(rtrim(number_format((float) $seller['vat_rate'], 2, ',', ''), '0'), ',') }} % @endif
                </div>
            </td>
        </tr>
    </table>

    <h1>FACTURE</h1>

    <table class="meta">
        <tr>
            <td><strong>Facture N° :</strong> {{ $order->bill_number }}</td>
            <td><strong>Date :</strong> {{ optional($order->created_at)->format('d/m/Y') }}</td>
            <td><strong>Commande N° :</strong> #{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Désignation</th>
                <th class="number">Quantité</th>
                <th class="number">Prix unitaire</th>
                <th class="number">Montant</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($purchases as $purchase)
                @php
                    $product = $purchase['product'] ?? [];
                    $quantity = (float) ($purchase['quantity'] ?? 0);
                    $unitPrice = (float) (!empty($product['is_discount'])
                        ? ($product['price_after_discount'] ?? $product['price'] ?? 0)
                        : ($product['price'] ?? 0));
                    $name = $product['name']['fr'] ?? $product['name']['en'] ?? 'Produit';
                @endphp
                <tr>
                    <td>{{ $name }}</td>
                    <td class="number">{{ rtrim(rtrim(number_format($quantity, 2, ',', ' '), '0'), ',') }}</td>
                    <td class="number">{{ number_format($unitPrice, 2, ',', ' ') }} DT</td>
                    <td class="number">{{ number_format($unitPrice * $quantity, 2, ',', ' ') }} DT</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Sous-total</td><td>{{ number_format((float) $order->subTotal, 2, ',', ' ') }} DT</td></tr>
        <tr><td>Livraison</td><td>{{ number_format((float) $order->delivery, 2, ',', ' ') }} DT</td></tr>
        <tr><td>Total HT</td><td>{{ number_format($invoiceTotals['pre_tax'], 2, ',', ' ') }} DT</td></tr>
        <tr class="tax-start">
            <td>TVA ({{ rtrim(rtrim(number_format($invoiceTotals['vat_rate'], 2, ',', ''), '0'), ',') }} %)</td>
            <td>{{ number_format($invoiceTotals['vat'], 2, ',', ' ') }} DT</td>
        </tr>
        <tr><td>Timbre fiscal</td><td>{{ number_format($invoiceTotals['stamp'], 2, ',', ' ') }} DT</td></tr>
        <tr class="grand-total"><td>Total TTC</td><td>{{ number_format($invoiceTotals['total'], 2, ',', ' ') }} DT</td></tr>
    </table>

    <div class="note">
        <strong>Mode de paiement :</strong> {{ $order->cutlery ? 'Tickets restaurant' : 'Paiement à la livraison' }}
        @if ($seller['rib'])<br><strong>RIB :</strong> {{ $seller['rib'] }}@endif
        @if ($order->message)<br><strong>Commentaire :</strong> {{ $order->message }}@endif
    </div>

    @if ($signature || $stamp)
        <table class="approval">
            <tr>
                <td>
                    <div class="seal-composite">
                        @if ($stamp)<img class="stamp-image" src="{{ $stamp }}" alt="Cachet">@endif
                        @if ($signature)<img class="signature-image" src="{{ $signature }}" alt="Signature">@endif
                    </div>
                </td>
            </tr>
        </table>
    @endif

    <div class="footer">Hbaq — Merci pour votre confiance.</div>
</body>
</html>
