<?php

namespace App\Http\Controllers\admin;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('company', 'addresses')->where('role','user')->get();
        $profiles = Profile::all();
        return inertia('Admin/User/Index',[
            'users'=> $users,
            'profiles'=>$profiles
        ]);
    }

    public function admins()
    {
        $users = User::where('role', '!=', 'user')->get();
        return inertia('Admin/User/Team',[
            'users'=> $users
        ]);
    }

    public function create()
    {
       return inertia('Admin/User/Create', [
            'companies' => Schema::hasTable('companies') ? Company::all() : collect(),
       ]);
    }

    public function store(Request $request)
    {
        $requiresAddress = $this->requiresAddress($request);

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed'],
            'role'=> 'required',
            'phone' => 'nullable',
            'company_id' => $this->companyValidationRule(),
            'country' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'state' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'city' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'zip' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_1' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_2' => 'nullable|string|max:255',
            'address_type' => 'nullable|in:billing,shipping',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = new User();
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->role = $request->input('role');
        $user->phone = $request->input('phone');
        $user->company_id = $request->input('company_id');
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/users');
            $user->picture = $imagePath;
        }
        $user->password = Hash::make($request->input('password'));
        $user->is_active = 1;
        $user->save();

        if ($request->filled('address_1')) {
            $user->addresses()->create($this->addressData($request));
        }

        // $user = User::create([
        //     'firstname' => $request->firstname,
        //     'lastname' => $request->lastname,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        //     'role'=> $request->role,
        //     'phone' => $request->phone,
            
        // ]);

        return redirect()->route('admin.users.team')->with('success','User has been created successfully');;
    }

    public function edit(User $user)
    {
        $user->load('company', 'addresses');

        return inertia('Admin/User/Edit', [
            'user' => $user,
            'companies' => Schema::hasTable('companies') ? Company::all() : collect(),
        ]);
       
    }

    public function update(Request $request, User $user)
    {
        $requiresAddress = $this->requiresAddress($request) && ! $user->addresses()->exists();

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role'=> 'required',
            'phone' => 'nullable',
            'company_id' => $this->companyValidationRule(),
            'country' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'state' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'city' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'zip' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_1' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_2' => 'nullable|string|max:255',
            'address_type' => 'nullable|in:billing,shipping',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->role = $request->input('role');
        $user->company_id = $request->input('company_id');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/users');
            $user->picture = $imagePath;
        }

        $user->save();

        if ($request->filled('address_1')) {
            $user->addresses()->updateOrCreate(
                ['type' => $request->input('address_type', 'shipping')],
                $this->addressData($request)
            );
        }
        
        
        return redirect()->route('admin.users.team')
                        ->with('success','User has been updated successfully');
    }
    public function show() {
        
    }

    public function destroy(User $user)
    {
        $user->delete();
        if($user->role=='user') {
            return redirect()->route('admin.users.index')
                    ->with('success','Customer has been deleted successfully');
        } else {
            return redirect()->route('admin.users.team')
                    ->with('success','Admin has been deleted successfully');
        }
    }
    public function validate_pended(User $user) {
        $user->pended = 1;
        $user->save();       
        return back()->with('success','Company has been accepted ');
    }

    function hasPendingUser()
    {
        return response()->json(User::where('pended', 0)->exists());
    }

    private function requiresAddress(Request $request): bool
    {
        return $request->input('role') === 'user' && ! $request->filled('company_id');
    }

    private function companyValidationRule(): string
    {
        return Schema::hasTable('companies')
            ? 'nullable|exists:companies,id'
            : 'nullable|integer';
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
