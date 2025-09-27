<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\PermissionRegistrar;

class RegisteredUserController extends Controller
{
  /**
   * Display the registration view.
   */
  public function create(): Response
  {
    return Inertia::render('Auth/Register');
  }

  /**
   * Handle an incoming registration request.
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request): RedirectResponse
  {
    $request->validate(
      [
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:users',
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
        'tenant_name' => 'required|string|max:255',
        'tenant_slug' => [
          'required',
          'string',
          'max:255',
          'unique:tenants,slug',
          'regex:/^[a-zA-Z-_]+$/u',
        ],
      ],
      [
        'tenant_slug.regex' => 'اسم النطاق يجب أن يحتوي على حروف إنجليزية وشرطات فقط.',
      ]
    );


    // Create user
    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

    // Create tenant
    $tenant = Tenant::create([
      'name' => $request->tenant_name,
      'slug' => $request->tenant_slug,
      'owner_id' => $user->id,
    ]);
    $user->tenant_id = $tenant->id;
    $user->save();

    // Assign tenant role/team using Spatie
    setPermissionsTeamId($tenant->id);
    $user->assignRole('tenant');
    setPermissionsTeamId(null);
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    event(new Registered($user));
    Auth::login($user);

    return redirect(route('dashboard', absolute: false));
  }
}
