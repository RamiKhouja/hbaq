<p><strong>New contact message from Hbaq</strong></p>

<p><strong>Name:</strong> {{ $emailData['name'] ?? 'Not provided' }}</p>
<p><strong>Email:</strong> {{ $emailData['from'] ?? 'Not provided' }}</p>
<p><strong>Phone:</strong> {{ $emailData['phone'] ?? 'Not provided' }}</p>

<p><strong>Message:</strong></p>
<p>{{ $emailData['message'] }}</p>
