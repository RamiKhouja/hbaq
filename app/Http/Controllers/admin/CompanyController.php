<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\CompanyGroup;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    //
    public function index()
     {
        $companies = Company::with('companyGroup', 'users')->get();
        return inertia('Admin/Company/Index', [
            'companies'=>$companies
        ]);
    }
    public function create()
    {
        $companyGroups =CompanyGroup::all();
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
                            'role' => 'required',
                            'companyGroup_id' =>'required'
                        ]);
        $name = array(
            'en' => $request->input('name_en'),
            'ar' => $request->input('name_ar')
        );
        $role= $request->input('role') ;
        $phone = $request->input('phone');
        $companyGroup =$request->input('companyGroup_id');
        $company = new Company();
        $company->name = $name;
        $company->role = $role;
        $company->phone = $phone;
        $company->companyGroup_id = $companyGroup;
        dd($company);
        $company->save();

        return redirect()->route('admin.company.index')->with('success','Company Created Successfully');
    }

    public function show(Company $company)
        {
            $company = Company::with('users.addresses')->find($company->id);
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
                'role' => 'required',
                'company_group_id' =>'required'
	        ]);
	        $company = Company::find($id);
            $name = array(
                'en' => $request->input('name_en'),
                'ar' => $request->input('name_ar')
            );
	        $company->name = $name;
	        $company->role = $request->input('role');
	        $company->phone = $request->input('phone');
            $company->company_group_id = $request->input('company_group_id');
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
}
