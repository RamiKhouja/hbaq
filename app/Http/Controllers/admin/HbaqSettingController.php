<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\HbaqSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HbaqSettingController extends Controller
{
    public function edit()
    {
        return inertia('Admin/HbaqSetting/Edit', [
            'settings' => HbaqSetting::first(),
        ]);
    }

    public function update(Request $request)
    {
        $settings = HbaqSetting::firstOrNew();
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'fiscal_number' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:1000'],
            'phone' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'rib' => ['nullable', 'string', 'max:255'],
            'vat_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'signature' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'stamp' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        foreach (['logo', 'signature', 'stamp'] as $imageField) {
            unset($validated[$imageField]);

            if (! $request->hasFile($imageField)) {
                continue;
            }

            if ($settings->{$imageField}) {
                Storage::delete($settings->{$imageField});
            }

            $settings->{$imageField} = $request->file($imageField)
                ->store('pictures/hbaq');
        }

        $settings->fill($validated)->save();

        return redirect()->route('admin.hbaq-settings.edit')
            ->with('success', 'Informations Hbaq enregistrées avec succès.');
    }
}
