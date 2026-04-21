<?php

return [
	'mode'                  => '',
	'format'                => 'A4',
	'default_font_size'     => '12',
	'default_font'          => 'sans-serif',
	'margin_left'           => 10,
	'margin_right'          => 10,
	'margin_top'            => 10,
	'margin_bottom'         => 10,
	'margin_header'         => 0,
	'margin_footer'         => 0,
	'orientation'           => 'P',
	'title'                 => 'Laravel mPDF',
	'author'                => 'test',
	'watermark'             => '',
	'show_watermark'        => false,
	'watermark_font'        => 'sans-serif',
	'display_mode'          => 'fullpage',
	'watermark_text_alpha'  => 0.1,
	'font_data' => [
		'DejaVu Sans ' => [
			'useOTL' => 0xFF,    // required for complicated langs like Persian, Arabic and Chinese
			'useKashida' => 75,  // required for complicated langs like Persian, Arabic and Chinese
		]
	]
];
