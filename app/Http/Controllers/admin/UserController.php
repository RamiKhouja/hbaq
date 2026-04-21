<?php

namespace App\Http\Controllers\admin;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role','user')->get();
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
       return inertia('Admin/User/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed'],
            'role'=> 'required',
            'phone' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = new User();
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->role = $request->input('role');
        $user->phone = $request->input('phone');
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/users');
            $user->picture = $imagePath;
        }
        $user->password = Hash::make($request->input('password'));
        $user->is_active = 1;
        $user->save();

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
        return inertia('Admin/User/Edit', [
            'user' => $user
        ]);
       
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role'=> 'required',
            'phone' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->role = $request->input('role');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->storePublicly('pictures/users');
            $user->picture = $imagePath;
        }

        $user->save();
        
        
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

   
}
