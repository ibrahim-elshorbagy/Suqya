<?php

namespace App\Http\Controllers\Admin\Management;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class UserManagementController extends Controller
{


  public function index(Request $request)
  {
    $request->validate([
      'name' => ['nullable', 'string', 'max:255'],
      'email' => ['nullable', 'string', 'max:255'],
      'username' => ['nullable', 'string', 'max:255'],
      'sort' => ['nullable', 'string', 'in:id,name,email,username,created_at'],
      'direction' => ['nullable', 'string', 'in:asc,desc'],
      'per_page' => ['nullable', 'integer', 'min:1'],
    ]);

    $sortField = $request->input('sort', 'id');
    $sortDirection = $request->input('direction', 'desc');
    $perPage = $request->input('per_page', 15);

    // Shared filter function
    $applyFilters = function ($query) use ($request) {
      if ($request->filled('name')) {
        $query->where('name', 'like', '%' . $request->name . '%');
      }
      if ($request->filled('email')) {
        $query->where('email', 'like', '%' . $request->email . '%');
      }
      if ($request->filled('username')) {
        $query->where('username', 'like', '%' . $request->username . '%');
      }
    };

    // Admins query using Spatie role scope, with roles eager loaded
    $adminsQuery = User::role('admin')->with('roles');
    setPermissionsTeamId(1);
    $applyFilters($adminsQuery);
    $admins = $adminsQuery
      ->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'admins_page')
      ->withQueryString();
    setPermissionsTeamId(null);

    // Tenants query using subquery to respect role and team structure
    $tenantsQuery = User::with(['tenant'])
      ->withTenantRole();

    $applyFilters($tenantsQuery);

    $tenants = $tenantsQuery
      ->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'tenants_page')
      ->withQueryString();

    $tenants->getCollection()->transform(function ($user) {
      if ($user->tenant_id) {
        setPermissionsTeamId($user->tenant_id);
        $user->load('roles');
        setPermissionsTeamId(null);
      }
      return $user;
    });


    $roles = Role::all();

    return inertia('Admin/Management/UserManagement/Users', [
      'admins' => $admins,
      'tenants' => $tenants,
      'roles' => $roles,
      'queryParams' => $request->query() ?: null,
    ]);
  }


  public function store(Request $request)
  {
    $rules = [
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
      'username' => ['required', 'string', 'max:255', 'unique:users'],
      'password' => ['required', Rules\Password::defaults(), 'confirmed'],
      'role' => ['required', 'string', 'exists:roles,name'],
    ];

    if ($request->role === 'tenant') {
      $rules['tenant_name'] = ['required', 'string', 'max:255'];
      $rules['tenant_slug'] = ['required', 'string', 'max:255', 'unique:tenants,slug', 'regex:/^[\p{Arabic}a-zA-Z0-9-_]+$/u'];
      $rules['tenant_phone'] = ['nullable', 'string', 'max:255'];
      $rules['tenant_address'] = ['nullable', 'string', 'max:255'];
    }

    $data = $request->validate($rules);

    // Create user
    $user = User::create([
      'name' => $data['name'],
      'email' => $data['email'],
      'username' => $data['username'],
      'password' => Hash::make($data['password']),
    ]);

    // Assign role

    if ($data['role'] == 'tenant') {
      // Create tenant with slug for tenant role
      $tenant = Tenant::create([
        'name' => $data['tenant_name'],
        'slug' => $data['tenant_slug'],
        'phone' => $data['tenant_phone'] ?? null,
        'address' => $data['tenant_address'] ?? null,
        'owner_id' => $user->id,
      ]);
      $user->tenant_id = $tenant->id;
      $user->save();

      // Set permissions context and clear cache
      setPermissionsTeamId($tenant->id);
      $user->assignRole($data['role']);
      setPermissionsTeamId(null);
      app()[PermissionRegistrar::class]->forgetCachedPermissions();
    } elseif ($data['role'] == 'admin') {
      // Assign admin tenant (id = 1) for admin role
      $user->tenant_id = 1;
      $user->save();

      setPermissionsTeamId(1);
      $user->assignRole($data['role']);
      setPermissionsTeamId(null);
    }

    return back()
      ->with('title', __('website_response.user_created_title'))
      ->with('message', __('website_response.user_created_message'))
      ->with('status', 'success');
  }



  public function update(Request $request, User $user)
  {
    // Check if it's a block/unblock request
    if ($request->has('blocked') && !$request->has('name')) {
      $request->validate([
        'blocked' => ['required', 'boolean'],
      ]);

      $user->update([
        'blocked' => $request->blocked,
      ]);

      $status = $request->blocked ? 'blocked' : 'unblocked';

      return back()
        ->with('title', __("website_response.user_{$status}_title"))
        ->with('message', __("website_response.user_{$status}_message"))
        ->with('status', $request->blocked ? 'warning' : 'success');
    }

    $rules = [
      'name' => ['required', 'string', 'max:255'],
      'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
      'username' => ['required', 'string', 'max:255', 'unique:users,username,' . $user->id],
      'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
    ];

    setPermissionsTeamId($user->tenant_id);
    $role = $user->roles()->pluck('name')->first();
    setPermissionsTeamId(null);

    if ($role == 'tenant') {
      $rules = array_merge($rules, [
        'tenant_name' => ['required', 'string', 'max:255'],
        'tenant_slug' => ['required', 'string', 'max:255', 'unique:tenants,slug,' . ($user->tenant?->id ?? 'NULL')],
        'tenant_phone' => ['nullable', 'string', 'max:255'],
        'tenant_address' => ['nullable', 'string', 'max:255'],
      ]);
    }

    $data = $request->validate($rules);

    $updateData = [
      'name' => $data['name'],
      'email' => $data['email'],
      'username' => $data['username'],
    ];

    if (!empty($data['password'])) {
      $updateData['password'] = Hash::make($data['password']);
    }

    $user->update($updateData);

    if ($role == 'tenant') {
      $tenant = $user->tenant;
      $tenant->update([
        'name' => $data['tenant_name'],
        'slug' => $data['tenant_slug'],
        'phone' => $data['tenant_phone'] ?? null,
        'address' => $data['tenant_address'] ?? null,
      ]);
    }

    return back()
      ->with('title', __('website_response.user_updated_title'))
      ->with('message', __('website_response.user_updated_message'))
      ->with('status', 'success');
  }

  public function destroy(Request $request, User $user)
  {
    // Don't allow deleting self
    if ($user->id === $request->user()->id) {
      return back()
        ->with('title', __('website_response.user_delete_error_title'))
        ->with('message', __('website_response.user_delete_error_self_message'))
        ->with('status', 'error');
    }

    $user->delete();

    return back()
      ->with('title', __('website_response.user_deleted_title'))
      ->with('message', __('website_response.user_deleted_message'))
      ->with('status', 'warning');
  }

  /**
   * Bulk block users
   */
  public function bulkBlock(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:users,id'
    ]);

    $count = User::whereIn('id', $request->ids)
      ->where('blocked', false)
      ->update(['blocked' => true]);

    return back()
      ->with('title', __('website_response.bulk_user_blocked_title'))
      ->with('message', __('website_response.bulk_user_blocked_message', ['count' => $count]))
      ->with('status', 'warning');
  }

  /**
   * Bulk unblock users
   */
  public function bulkUnblock(Request $request)
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:users,id'
    ]);

    $count = User::whereIn('id', $request->ids)
      ->where('blocked', true)
      ->update(['blocked' => false]);

    return back()
      ->with('title', __('website_response.bulk_user_unblocked_title'))
      ->with('message', __('website_response.bulk_user_unblocked_message', ['count' => $count]))
      ->with('status', 'success');
  }

  /**
   * Bulk delete users
   */
  public function bulkDelete(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array'],
      'ids.*' => ['required', 'integer', 'exists:users,id'],
    ]);

    $ids = $request->input('ids');

    // Don't allow deleting self
    if (in_array($request->user()->id, $ids)) {
      return back()
        ->with('title', __('website_response.user_delete_error_title'))
        ->with('message', __('website_response.user_delete_error_self_message'))
        ->with('status', 'error');
    }

    $count = User::whereIn('id', $ids)->count();
    User::whereIn('id', $ids)->delete();

    return back()
      ->with('title', __('website_response.users_deleted_title'))
      ->with('message', __('website_response.users_deleted_message', ['count' => $count]))
      ->with('status', 'warning');
  }
}
