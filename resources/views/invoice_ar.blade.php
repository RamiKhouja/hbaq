<!DOCTYPE html>
<html  lang="ar">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" lang="ar"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
  <title>Invoice</title>
  <style>
      body {
        font-family: "Cairo", sans-serif;
        font-style: normal;
        direction: rtl
      }
  </style>
</head>
<body>
    <h1>Invoice</h1>
    <h2>{{$user->company->name['en']}}</h2>
    <p>123 Street Name<br>City, State, Country</p>
    <h2>Bill To:</h2>
    <p>{{$user->name}}<br>user address</p>
    <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Item</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
                  @foreach($order->purchases as $purchase)
                    <tr key={person.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {{$purchase->product->name['en']}}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{$purchase->quantity}}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{$purchase->price / $purchase->quantity}}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">{{$purchase->price}}</td>
                      
                    </tr>
                  @endforeach
                </tbody>
    </table>
</div>
</div>
</div>
    <p>Total: {{$order->total}} SAR</p>
    <p class="text-right">{{$order->total_letters}}</p>
    <div >أهلا وسهلا</div>
</body>
</html>
