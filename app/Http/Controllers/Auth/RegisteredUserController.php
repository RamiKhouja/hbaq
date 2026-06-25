<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Wallet;
use App\Models\CompanyGroup;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function checkCompanyMf(Request $request): JsonResponse
    {
        $request->validate([
            'mf' => 'required|string|max:255',
        ]);

        $mf = trim($request->input('mf'));

        if (! Schema::hasTable('companies')) {
            return response()->json([
                'exists' => false,
                'company' => null,
            ]);
        }

        $company = Company::query()
            ->where('mf', $mf)
            ->orWhere('mf->value', $mf)
            ->first();

        return response()->json([
            'exists' => (bool) $company,
            'company' => $company ? [
                'id' => $company->id,
                'name' => $company->name,
                'phone' => $company->phone,
                'email' => $company->email,
                'mf' => $company->mf,
            ] : null,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $isCompanyUser = $request->input('account_type') === 'company';
        $isNewCompany = $isCompanyUser && ! $request->filled('company_id');
        $requiresAddress = ! $isCompanyUser;

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => 'required|string|max:255',
            'account_type' => 'nullable|in:user,company',
            'company_id' => Schema::hasTable('companies') ? 'nullable|exists:companies,id' : 'nullable|integer',
            'country' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'state' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'city' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'zip' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_1' => [Rule::requiredIf($requiresAddress), 'nullable', 'string', 'max:255'],
            'address_2' => 'nullable|string|max:255',
            'address_type' => 'nullable|in:billing,shipping',
            'company_mf' => [Rule::requiredIf($isCompanyUser), 'nullable', 'string', 'max:255'],
            'company_name' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_phone' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_email' => 'nullable|email|max:255',
            'mf_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:5120',
            'company_country' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_state' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_city' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_zip' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_address_1' => [Rule::requiredIf($isNewCompany), 'nullable', 'string', 'max:255'],
            'company_address_2' => 'nullable|string|max:255',
        ]);

        $companyId = $request->company_id;

        if ($isNewCompany) {
            $company = new Company();
            $company->name = [
                'en' => $request->company_name,
                'ar' => $request->company_name,
            ];
            $company->mf = [
                'value' => $request->company_mf,
            ];
            $company->phone = $request->company_phone;
            $company->email = $request->company_email;

            if ($request->hasFile('mf_image')) {
                $company->mf_image = $request->file('mf_image')->storePublicly('pictures/companies');
            }

            $company->save();
            $companyId = $company->id;

            $company->addresses()->create([
                'country' => $request->company_country,
                'state' => $request->company_state,
                'city' => $request->company_city,
                'zip' => $request->company_zip,
                'address_1' => $request->company_address_1,
                'address_2' => $request->company_address_2,
                'type' => 'shipping',
            ]);
        }

        $userAddress = [
            'country' => $request->input('country', 'Tunisia'),
            'state' => $request->input('state'),
            'city' => $request->input('city'),
            'zip' => $request->input('zip'),
            'address' => $request->input('address_1'),
            'address_2' => $request->input('address_2'),
        ];

        if ($isCompanyUser) {
            $userAddress = [
                'country' => 'Tunisia',
                'state' => null,
                'city' => null,
                'zip' => null,
                'address' => null,
                'address_2' => null,
            ];
        }

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role'=>"user",
            'phone' => $request->phone,
            'company_id' => $companyId,
            'is_active'=> true,
            'country' => $userAddress['country'],
            'state' => $userAddress['state'],
            'city' => $userAddress['city'],
            'zip' => $userAddress['zip'],
            'address' => $userAddress['address'],
            'address_2' => $userAddress['address_2'],
        ]);

        if ($request->filled('address_1')) {
            $user->addresses()->create([
                'country' => $request->country,
                'state' => $request->state,
                'city' => $request->city,
                'zip' => $request->zip,
                'address_1' => $request->address_1,
                'address_2' => $request->address_2,
                'type' => $request->input('address_type', 'shipping'),
            ]);
        }
        

        // event(new Registered($user));

        // Auth::login($user);

        // return redirect(RouteServiceProvider::HOME);
        return redirect("login")->with('success','You successfully registered to our platform, we will send you when your account is verified!');
    }
}
