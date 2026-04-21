<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyGroup;
use Illuminate\Http\Request;

class CompanyGroupController extends Controller
{
    public function index()
    {
        $companyGroups = CompanyGroup::all();

        return inertia('Admin/Group/Index', [
            'companyGroups' => $companyGroups,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Group/Create');
    }

    public function store(Request $request)
    {
        // Validate the request

        CompanyGroup::create($request->all());

        return redirect()->route('admin.company-groups.index');
    }

    public function edit(CompanyGroup $group)
    {
        return inertia('Admin/Group/Edit', [
            'companyGroup' => $group,
        ]);
    }

    public function update(Request $request, CompanyGroup $group)
    {
        // Validate the request

        $group->update($request->all());

        return redirect()->route('admin.company-groups.index');
    }

    public function destroy(CompanyGroup $group)
    {
        $group->delete();

        return redirect()->route('admin.company-groups.index');
    }
}
