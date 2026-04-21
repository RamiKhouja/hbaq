<!DOCTYPE html>
<html >
<head>
    <title>Invoice</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        body { 
          font-family: DejaVu Sans, serif; 
        }
        div.top {
          padding: 1rem; 
          border-radius: 1rem; 
          border: 1px solid black; 
          margin-bottom: 32px;
        }
        p.small {
          font-size: 12px;
          line-height: 0.8;
        }
        p.medium {
          font-size: 16px;
          line-height: 1.2;
        }
        .bottomtab, .bottomtab td {
          border: 1px solid black; 
          border-collapse: collapse;
          font-size: 12px;
          line-height: 1;
        }
        .thead {
          background-color: #AED6F1;
        }
        .tbody td {
          padding: 8px;
          text-align: right;
        }
        td.bg-blue {
          background-color: #AED6F1;
        }
        table.bot td {
          width: 16%;
          padding-right:4px;
          padding-left:4px;
        }
    </style>
</head>
<body>
    <?php
        $imagePath = public_path('pictures/logo-2.png');
        $imageData = base64_encode(file_get_contents($imagePath));
        $imageSrc = 'data:image/png;base64,' . $imageData;

        $address = $user->addresses[0];
        
    ?>
    <div class="top">
      <div style="width: 100%; text-align: center; margin-top: 16px;">
        <div style="display:inline-block; vertical-align: middle; width:35%; text-align: left; font-size: 14px;">
          <div>SEOOF AL SILM TRADING CO</div>
          <div>CR: 1010931475</div>
          <div>Riyadh, Al-Hair Road, Al-Masanaa. Al-Thawdah Dist</div>
          <div>VAT N°: 310170488800003</div>
        </div>
        <div style="display:inline-block; margin-right: 5%; margin-left: 5%; vertical-align: middle; width:15%;">
          <img
            src="{{$imageSrc}}"
            alt="Seoof"
            width="100"
          />
        </div>
        <div style="display:inline-block; vertical-align: middle; text-align: right; width:35%; font-size: 14px;">
          <div>شركة سيوف السلم للتجارة</div>
          <div>السجل التجاري: 1010931475</div>
          <div>الرياض, طريق الحائر,المصانع. حي الثودة</div>
          <div>الرقم الضريبي: 310170488800003</div>
        </div>
      </div>
    </div>
    <div>
      <table style="width: 100%;">
        <tr>
          <td style="text-align: left;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:50px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">
                  
                </p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">رقم الصفحة</p>
                  <p class="small">Page N°</p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align: center;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:250px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">TAX INVOICE فاتورة المبيعات</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small"></p>
                  <p class="small"></p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align: right;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:100px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">الرئيسي</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">مركز التكلفة</p>
                  <p class="small">Cost Center</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: left;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:50px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">أجل</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">نوع الفاتورة</p>
                  <p class="small">Invoice Type</p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align: center;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:150px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">2400013</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">رقم الفاتورة</p>
                  <p class="small">Invoice N°</p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align: right;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:100px; text-align: center; vertical-align:middle;">
                <p class="small" style="margin: 12px;">{{substr($order->created_at,0,10)}}</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">التاريخ</p>
                  <p class="small">Date</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="text-align: left;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:150px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">{{$user->company->vat}}</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">رقم ضريبة العميل</p>
                  <p class="small">Cust Tax N°</p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align: right;" colspan="2">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:350px; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">شركة حاضنة الأفكار لتجارة الجملة والتجزئة</p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">اسم العميل</p>
                  <p class="small">Cust Name</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;">
            <div style="">
              <div style="border: 1px solid black; display:inline-block; height: 40px; width:87%; text-align: center; vertical-align:middle;">
                <p class="medium" style="margin: 4px;">
                {{$address->state}}, {{$address->city}}, {{$address->address_1}} {{$address->address_2}}
                </p>
              </div>
              <div style="display:inline-block; vertical-align:middle;">
                <div>
                  <p class="small">عنوان العميل</p>
                  <p class="small">Cust Address</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
      <table class="bottomtab" style="margin-top: 16px; width:100%;" >
        <tr class="thead">
          <td style="text-align: center;">
            <p><b>تسلسل</b></p>
            <p>Si N°</p>
          </td>
          <td style="text-align: center;">
            <p><b>الباركود</b></p>
            <p>Barcode</p>
          </td>
          <td style="text-align: center;">
            <p><b>البيان</b></p>
            <p>Description</p>
          </td>
          <td style="text-align: center;">
            <p><b>الوحدة</b></p>
            <p>Unit</p>
          </td>
          <td style="text-align: center;">
            <p><b>الكمية</b></p>
            <p>Qty</p>
          </td>
          <td style="text-align: center;">
            <p><b>السعر</b></p>
            <p>Price</p>
          </td>
          <td style="text-align: center;">
            <p><b>المجموع</b></p>
            <p>Total</p>
          </td>
          <td style="text-align: center;">
            <p><b>الضريبة</b></p>
            <p>VAT 15%</p>
          </td>
          <td style="text-align: center;">
            <p><b>الإجمالي</b></p>
            <p>Net Amount</p>
          </td>
        </tr>
        @php 
        $qty = 0;
        $i = 1;
        @endphp
        @foreach($order->purchases as $purchase)
        @php 
        $qty = $qty+$purchase->quantity;
        @endphp
        <tr class="tbody">
          <td>{{$i++;}}</td>
          <td>{{$purchase->product->sku}}</td>
          <td style="max-width: 200px;">{{$purchase->product->name['ar']}}</td>
          <td>{{$purchase->type == 'item'?('حبة'): ('حزمة')}}</td>
          <td>{{$purchase->quantity}}</td>
          <td>{{$purchase->price / $purchase->quantity}}</td>
          <td>{{$purchase->price}}</td>
          <td>{{$purchase->price / 100 *15}}</td>
          <td>{{$purchase->price / 100 *15 + $purchase->price}}</td>
        </tr>
        @endforeach
      </table>
      <table class="bottomtab bot" style="margin-top: 32px; width:100%; text-align:right;" >
        <tr>
          <td rowspan="2"></td>
          <td rowspan="2" class="bg-blue">
            <p class="small"><b>أمر الشراء</b></p>
            <p class="small"><b>P.O N°</b></p>
          </td>
          <td rowspan="2">{{$qty}}</td>
          <td rowspan="2" class="bg-blue">
            <p class="small"><b>إجمالي الكمية</b></p>
            <p class="small"><b>Total Qty</b></p>
          </td>
          <td>{{$order->subTotal}}</td>
          <td class="bg-blue"><p class="small"><b>Total المجموع</b></p></td>
        </tr>
        <tr>
          <td>0.00</td>
          <td class="bg-blue"><p class="small"><b>Discount الخصم</b></p></td>
        </tr>
        <tr>
          <td rowspan="3" colspan="4">
            <p class="medium">{{$order->total_letters}}</p>
          </td>
          <td>{{$order->subTotal * $order->tax}}</td>
          <td class="bg-blue"><p class="small"><b>Vat 15% الضريبة</b></p></td>
        </tr>
        <tr>
          <td>
            10.00
          </td>
          <td class="bg-blue">
            <p class="small"><b>Shipping الشحن</b></p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="medium">{{$order->total}}</p>
          </td>
          <td class="bg-blue">
            <p class="small"><b>الإجمالي</b></p>
            <p class="small"><b>Net Amount</b></p>
          </td>
        </tr>
      </table>
    </div>
    <div>
        
    </div>
    <script type="text/php">
      if (isset($pdf)) {
          $text = "{PAGE_NUM} / {PAGE_COUNT}";
          $size = 10;
          $font = $fontMetrics->getFont("Verdana");
          $width = $fontMetrics->get_text_width($text, $font, $size) / 2;
          $x = ($pdf->get_width() - $width) / 2;
          $y = $pdf->get_height() - 35;
          $pdf->page_text($x, $y, $text, $font, $size);
      }
    </script>
    
</body>
</html>
