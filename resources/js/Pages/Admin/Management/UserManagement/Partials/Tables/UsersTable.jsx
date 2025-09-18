import ActionButton from '@/Components/ActionButton';
import SelectableTable from '@/Components/SelectableTable';
import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';

export default function UsersTable({ users, onEdit }) {
  const { t } = useTrans();

  // Individual user actions
  const toggleBlock = (userId, currentBlockedStatus) => {
    router.put(route('admin.users.update', userId), {
      blocked: !currentBlockedStatus
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteUser = (user) => {
    if (confirm(`${t('are_you_sure_delete')} "${user.name}"?`)) {
      router.delete(route('admin.users.destroy', user.id), {
        preserveScroll: true,
      });
    }
  };

  // Bulk action handlers
  const handleBulkBlock = async (ids) => {
    router.patch(route('admin.users.bulk.block'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkUnblock = async (ids) => {
    router.patch(route('admin.users.bulk.unblock'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkDelete = async (ids) => {
    router.delete(route('admin.users.bulk.delete'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions for users
  const bulkActions = [
    {
      label: t('block_users'),
      icon: 'fa-solid fa-ban',
      handler: handleBulkBlock,
      variant: 'yellow',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_block_users'
    },
    {
      label: t('unblock_users'),
      icon: 'fa-solid fa-check-circle',
      handler: handleBulkUnblock,
      variant: 'blue',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_unblock_users'
    },
    {
      label: t('delete_users'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDelete,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_users'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'id', label: t('id'), icon: 'fa-hashtag' },
    { field: 'name', label: t('name'), icon: 'fa-user' },
    { field: 'email', label: t('email_address'), icon: 'fa-envelope' },
    { field: 'username', label: t('username'), icon: 'fa-at' },
    { field: 'status', label: t('status'), icon: 'fa-circle-info' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  // Define which fields to show in mobile cards (excluding actions)
  const cardFields = [
    { field: 'name', label: t('name'), icon: 'fa-user' },
    { field: 'email', label: t('email_address'), icon: 'fa-envelope' },
    { field: 'username', label: t('username'), icon: 'fa-at' },
    { field: 'status', label: t('status'), icon: 'fa-circle-info' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'name', label: t('name') },
    { field: 'email', label: t('email_address') },
    { field: 'username', label: t('username') },
    { field: 'blocked', label: t('status') },
    { field: 'created_at', label: t('created_at') }
  ];

  const renderRow = (user) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {user.id}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-user text-blue-500"></i>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {user.name}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-blue-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {user.email}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-at text-blue-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {user.username}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.blocked
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
          <i className={`fa-solid ${user.blocked ? 'fa-ban' : 'fa-check-circle'} mx-1`}></i>
          {user.blocked ? t('blocked') : t('active')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t('are_you_sure_login_as') + ` \"${user.name}\"?`)) {
                router.post(route('admin.login_as', user.id), {}, { preserveScroll: true });
              }
            }}
            variant="info"
            icon="fa-right-to-bracket"
            size="xs"
            as="button"
          >
            {t('login_as')}
          </ActionButton>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            variant="edit"
            icon="fa-edit"
            size="xs"
            as="button"
          >
            {t('edit')}
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBlock(user.id, user.blocked);
            }}
            variant={user.blocked ? "success" : "delete"}
            icon={user.blocked ? "fa-check-circle" : "fa-ban"}
            size="xs"
            as="button"
          >
            {user.blocked ? t('unblock') : t('block')}
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user);
            }}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('delete')}
          </ActionButton>
        </div>
      </td>
    </>
  );

  // Custom card renderer for better mobile experience
  const renderCard = (user, isSelected, handleSelect, index) => {
    return (
      <div
        key={user.id}
        className={`
          relative p-4 rounded-lg border transition-all duration-200
          ${isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
            : user.blocked
              ? 'border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-700'
              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
          }
          hover:shadow-md
        `}
      >
        {/* Selection checkbox */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              handleSelect(user);
            }}
          />
        </div>

        {/* User Avatar and Basic Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            {user.image_url ? (
              <img
                src={user.image_url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 dark:border-blue-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <i className="fa-solid fa-user text-blue-600 dark:text-blue-400 text-lg"></i>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {user.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {user.email}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Tenant Info */}
        {user.roles && user.roles.length > 0 && user.roles[0].name === 'tenant' && user.tenant && (
          <div className="mb-3 p-3 space-y-1
            [&>div]:flex [&>div]:items-center [&>div]:gap-3
            [&>div>i]:w-3 [&>div>i]:inline-flex [&>div>i]:justify-center
            text-blue-700 dark:text-white text-sm rounded
            bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700"
          >
            <div>
              <i className="fa-solid fa-building"></i>
              <span>{t('tenant_name')}: {user.tenant.name}</span>
            </div>
            <div>
              <i className="fa-solid fa-link"></i>
              <span>{t('tenant_slug')}: {user.tenant.slug}</span>
            </div>
            {user.tenant.phone && (
              <div>
                <i className="fa-solid fa-phone"></i>
                <span>{t('tenant_phone')}: {user.tenant.phone}</span>
              </div>
            )}
            {user.tenant.address && (
              <div>
                <i className="fa-solid fa-location-dot"></i>
                <span>{t('tenant_address')}: {user.tenant.address}</span>
              </div>
            )}
          </div>

        )}

        {/* Status and Role */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.blocked
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
            <i className={`fa-solid ${user.blocked ? 'fa-ban' : 'fa-check-circle'} mx-1`}></i>
            {user.blocked ? t('blocked') : t('active')}
          </span>

        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          <i className="fa-solid fa-calendar"></i>
          <span>{t('created_at')}: {new Date(user.created_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            variant="edit"
            icon="fa-edit"
            size="xs"
            as="button"
          >
            {t('edit')}
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBlock(user.id, user.blocked);
            }}
            variant={user.blocked ? "success" : "delete"}
            icon={user.blocked ? "fa-check-circle" : "fa-ban"}
            size="xs"
            as="button"
          >
            {user.blocked ? t('unblock') : t('block')}
          </ActionButton>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t('are_you_sure_login_as') + ` \"${user.name}\"?`)) {
                router.post(route('admin.login_as', user.id), {}, { preserveScroll: true });
              }
            }}
            variant="info"
            icon="fa-right-to-bracket"
            size="xs"
            as="button"
          >
            {t('login_as')}
          </ActionButton>
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user);
            }}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('delete')}
          </ActionButton>
        </div>
      </div>
    );
  };

  // Row styling function for desktop table
  const getRowClassName = (user, index, isSelected) => {
    if (isSelected) return '';

    if (user.blocked) {
      return 'bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900';
    } else {
      return index % 2 === 0
        ? 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        : 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800';
    }
  };

  // Card styling function for mobile cards
  const getCardClassName = (user, index, isSelected) => {
    if (isSelected) return '';

    if (user.blocked) {
      return 'hover:bg-red-100 dark:hover:bg-red-900';
    }
    return 'hover:bg-neutral-50 dark:hover:bg-neutral-750';
  };

  return (
    <SelectableTable
      columns={columns}
      data={users ? users.data : []}
      pagination={users}
      routeName="admin.users.index"
      queryParams={{}}
      sortOptions={sortOptions}
      defaultSortField={'created_at'}
      defaultSortDirection={'desc'}
      renderRow={renderRow}
      renderCard={renderCard}
      getRowClassName={getRowClassName}
      getCardClassName={getCardClassName}
      bulkActions={bulkActions}
      cardFields={cardFields}
    />
  );
}
