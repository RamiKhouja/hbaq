<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Nouvelle commande</title>
</head>
<body style="font-family: Arial, sans-serif; color: #292524; line-height: 1.5;">
    <h1 style="font-size: 22px;">Nouvelle commande #{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</h1>

    <h2 style="font-size: 17px;">Informations du client</h2>
    <p>
        <strong>Nom :</strong> {{ $customer['name'] ?: 'Non renseigné' }}<br>
        <strong>Téléphone :</strong> {{ $customer['phone'] ?: 'Non renseigné' }}<br>
        <strong>Adresse :</strong> {{ $customer['address'] ?: 'Non renseignée' }}
    </p>

    <h2 style="font-size: 17px;">Détails de la commande</h2>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1; text-align: left;">Produit</th>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1; text-align: right;">Quantité</th>
                <th style="padding: 8px; border-bottom: 1px solid #d6d3d1; text-align: right;">Prix</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($purchases as $purchase)
                @php
                    $product = $purchase['product'] ?? [];
                    $name = $product['name']['fr'] ?? $product['name']['en'] ?? 'Produit';
                    $quantity = $purchase['quantity'] ?? 0;
                    $unitPrice = !empty($product['is_discount'])
                        ? ($product['price_after_discount'] ?? $product['price'] ?? 0)
                        : ($product['price'] ?? 0);
                @endphp
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">{{ $name }}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: right;">{{ $quantity }}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #e7e5e4; text-align: right;">
                        {{ number_format((float) $unitPrice * (float) $quantity, 2, ',', ' ') }} DT
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top: 18px;">
        <strong>Sous-total :</strong> {{ number_format((float) $order->subTotal, 2, ',', ' ') }} DT<br>
        <strong>Livraison :</strong> {{ number_format((float) $order->delivery, 2, ',', ' ') }} DT<br>
        <strong>Total :</strong> {{ number_format((float) $order->total, 2, ',', ' ') }} DT<br>
        <strong>Paiement :</strong> {{ $order->cutlery ? 'Tickets restaurant' : 'À la livraison' }}<br>
        <strong>Statut :</strong> En attente
    </p>

    @if ($order->message)
        <p><strong>Commentaire :</strong> {{ $order->message }}</p>
    @endif
</body>
</html>
