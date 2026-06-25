<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CompanyController extends Controller
{
    //
    public function index()
     {
        $companies = Company::with('users', 'addresses')->get();
        return inertia('Admin/Company/Index', [
            'companies'=>$companies
        ]);
    }
    public function create()
    {
        $companyGroups = Schema::hasTable('company_groups') ? DB::table('company_groups')->get() : collect();
        return inertia('Admin/Company/Create',[
            'companyGroups'=>$companyGroups
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name_en' => 'required',
            'name_ar' => 'required',
            'phone' => 'required',
            'email' => 'nullable|email',
            'role' => 'required',
            'companyGroup_id' => 'nullable',
            'company_group_id' => 'nullable',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'mf_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:5120',
            'country' => 'required_with:address_1|nullable|string|max:255',
            'state' => 'required_with:address_1|nullable|string|max:255',
            'city' => 'required_with:address_1|nullable|string|max:255',
            'zip' => 'required_with:address_1|nullable|string|max:255',
            'address_1' => 'nullable|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'address_type' => 'nullable|in:billing,shipping',
        ]);
        $name = array(
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar')
        );
        $company = new Company();
        $company->name = $name;
        $company->role = $request->input('role');
        $company->phone = $request->input('phone');
        $company->email = $request->input('email');
        $company->company_group_id = $request->input('company_group_id', $request->input('companyGroup_id'));

        if ($request->hasFile('logo')) {
            $company->logo = $request->file('logo')->storePublicly('pictures/companies');
        }

        if ($request->hasFile('mf_image')) {
            $company->mf_image = $request->file('mf_image')->storePublicly('pictures/companies');
        }

        $company->save();

        if ($request->filled('address_1')) {
            $company->addresses()->create($this->addressData($request));
        }

        return redirect()->route('admin.company.index')->with('success','Company Created Successfully');
    }

    public function show(Company $company)
        {
            $company = Company::with('users.addresses', 'addresses')->find($company->id);
            //dd($company);
            return inertia('Admin/Company/Show',$company);
        } 
    public function edit(Company $company)
    {
        return inertia('Admin/Company/Edit', [
            'company' => $company,
        ]);
    }
    public function update(Request $request, $id)
	    {
	        $request->validate([
	            'name_en' => 'required',
                'name_ar' => 'required',
                'phone' => 'required',
                'email' => 'nullable|email',
                'role' => 'required',
                'company_group_id' =>'nullable',
                'companyGroup_id' =>'nullable',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'mf_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:5120',
	        ]);
	        $company = Company::find($id);
            $name = array(
                'en' => $request->input('name_en'),
                'ar' => $request->input('name_ar')
            );
	        $company->name = $name;
	        $company->role = $request->input('role');
	        $company->phone = $request->input('phone');
            $company->email = $request->input('email');
            $company->company_group_id = $request->input('company_group_id', $request->input('companyGroup_id'));

            if ($request->hasFile('logo')) {
                $company->logo = $request->file('logo')->storePublicly('pictures/companies');
            }

            if ($request->hasFile('mf_image')) {
                $company->mf_image = $request->file('mf_image')->storePublicly('pictures/companies');
            }

	        $company->save();
	        return redirect()->route('admin.company.index')
	                        ->with('success','Company Has Been updated successfully');
        }
        public function destroy(Company $company)
	    {
	        $company->delete();
	        return redirect()->route('admin.company.index')
	                        ->with('success','Company has been deleted successfully');
        }

    private function addressData(Request $request): array
    {
        return [
            'country' => $request->input('country'),
            'state' => $request->input('state'),
            'city' => $request->input('city'),
            'zip' => $request->input('zip'),
            'address_1' => $request->input('address_1'),
            'address_2' => $request->input('address_2'),
            'type' => $request->input('address_type', 'shipping'),
        ];
    }
}
