<?php

namespace App\Http\Controllers\admin;

use App\Models\Address;
use App\Models\Company;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdressController extends Controller
{
    public function add(Request $request, User $user)  {
        $user->addresses()->create($this->validatedAddress($request, [
            'user_id' => $user->id,
            'company_id' => null,
        ]));

        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been added successfully');
    }
   
    public function store(Request $request)
    {
        $data = $this->validatedAddress($request);

        if (empty($data['user_id']) && empty($data['company_id'])) {
            return back()->withErrors([
                'owner' => 'An address must belong to a user or a company.',
            ]);
        }

        Address::create($data);

        return back()->with('success','adress Has Been added successfully');
    }

    public function edit(User $user, Address $address) {
        $companies = Company::all();
        return inertia('Admin/User/Edit', [
            'address'=> $address,
            'user' => $user,
            'companies'=> $companies
        ]);
    }

    public function update(Request $request, User $user, Address $address) {
        $address->update($this->validatedAddress($request, [
            'user_id' => $user->id,
            'company_id' => null,
        ]));

        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been updated successfully');
    }

    public function destroy(User $user, Address $address) {
        if ($address->user_id !== $user->id) {
            abort(404);
        }

        $address->delete();

        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been deleted successfully');
        
    }

    private function validatedAddress(Request $request, array $overrides = []): array
    {
        $rules = [
            'country' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'required|string|max:255',
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'type' => ['required', Rule::in(['billing', 'shipping'])],
            'user_id' => 'nullable|exists:users,id',
            'company_id' => 'nullable|exists:companies,id',
        ];

        $data = $request->validate($rules);

        return array_merge($data, $overrides);
    }
}
