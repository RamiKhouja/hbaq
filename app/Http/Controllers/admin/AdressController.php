<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdressController extends Controller
{
    public function add(Request $request, User $user)  {
        $user->adresses->create($request->all());
        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been added successfully');
    }
   
    public function edit(User $user, Adress $address) {
        $companies = Company::all();
        return inertia('Admin/User/Edit', [
            'adress'=> $adress,
            'user' => $user,
            'companies'=> $companies
        ]);
    }

    public function update(Request $request, User $user, Adress $adress) {
        $adress->type = $request->input('type');
        $adress->designation = $request->input('designation');
        $adress->adress_1 = $request->input('adress_1');
        $adress->adress_2 = $request->input('adress_2');
        $adress->zip = $request->input('zip');
        $adress->city = $request->input('city');
        $adress->province = $request->input('province');
        $adress->save();
        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been updated successfully');
    }

    public function destroy(User $user, Adress $adress) {
        $address = $user->addresses()->find($request->input('address_id'));
        $address->delete();
        return redirect()->route('admin.users.index')
                        ->with('success','adress Has Been deleted successfully');
        
    }
}
