import React, { useState, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import TableControls from '@/Components/TableControls';
import { router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function SelectableTable({
  columns,
  data,
  onRowClick = null,
  routeName,
  queryParams = {},
  renderRow = null,
  renderCard = null, // New prop for custom card rendering
  idField = 'id',
  pagination = null,
  onSort = null,
  bulkActions = [],
  sortOptions = [],
  defaultSortField = null,
  defaultSortDirection = 'asc',
  perPageOptions = [10, 25, 50, 100],
  defaultPerPage = 15,
  getRowClassName = null,
  getCardClassName = null, // New prop for custom card styling
  showSelection = true,
  cardFields = [], // New prop to specify which fields to show in cards
}) {
  // Initialize translation
  const { t } = useTrans();

  // State
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortField, setSortField] = useState(defaultSortField || '');
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [perPage, setPerPage] = useState(queryParams.per_page || 15);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset selections when data changes
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [data]);

  // Handle row selection
  const handleSelect = (item) => {
    setSelectedItems(prev => {
      const itemId = item[idField];
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll || selectedItems.length === data.length) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(data.map(item => item[idField]));
      setSelectAll(true);
    }
  };

  // Handle sorting
  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);

    if (onSort) {
      onSort(field, direction);
    } else if (routeName) {
      const params = new URLSearchParams(queryParams);
      params.set('sort', field);
      params.set('direction', direction);
      router.get(route(routeName, {
        ...route().params,
        ...Object.fromEntries(params)
      }), {}, { preserveState: true });
    }
  };

  // Handle per page change
  const handlePerPageChange = (value) => {
    setPerPage(value);

    if (routeName) {
      const routeParams = { ...route().params };
      if (routeParams.page) {
        delete routeParams.page;
      }
      routeParams.per_page = value;
      router.get(route(routeName, routeParams), {}, { preserveState: true });
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action, ids) => {
    if (action.handler) {
      await action.handler(ids);
      setSelectedItems([]);
    }
  };

  // Default card renderer
  const defaultCardRenderer = (item, isSelected, index) => {
    const displayFields = cardFields.length > 0 ? cardFields : columns.filter(col => col.field !== 'actions');

    return (
      <div
        key={item[idField]}
        className={`
          relative p-4 rounded-lg border transition-all duration-200
          ${isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
            : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:shadow-md'
          }
          ${getCardClassName ? getCardClassName(item, index, isSelected) : ''}
          ${onRowClick ? 'cursor-pointer' : ''}
        `}
        onClick={onRowClick ? () => onRowClick(item) : undefined}
      >
        {/* Selection checkbox */}
        {showSelection && (
          <div className="absolute top-3 right-3">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleSelect(item);
              }}
            />
          </div>
        )}

        {/* Card content */}
        <div className="space-y-2">
          {displayFields.map((column, colIndex) => {
            if (column.field === 'actions') return null;

            const value = column.render
              ? column.render(item)
              : item[column.accessor || column.field] || '-';

            return (
              <div key={colIndex} className="flex items-start gap-2">
                {column.icon && (
                  <i className={`fa-solid ${column.icon} text-neutral-500 dark:text-neutral-400 mt-0.5 text-sm`}></i>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                    {column.label}
                  </span>
                  <div className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                    {typeof value === 'string' || typeof value === 'number' ? value : (
                      <div>{value}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Actions */}
          {columns.find(col => col.field === 'actions') && renderRow && (
            <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-end">
                {/* Extract actions from renderRow - this is a bit hacky but works */}
                {(() => {
                  // Create a temporary container to render the row and extract actions
                  const tempRow = renderRow(item, isSelected, handleSelect);
                  const actionsCell = React.Children.toArray(tempRow.props.children).find(
                    child => child.props?.className?.includes('font-medium') ||
                             child.props?.children?.props?.className?.includes('gap-2')
                  );
                  return actionsCell?.props?.children || null;
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render mobile cards
  const renderCards = () => (
    <div className="space-y-3">
      {data.length > 0 ? (
        data.map((item, index) => {
          const isSelected = selectedItems.includes(item[idField]);

          return renderCard
            ? renderCard(item, isSelected, handleSelect, index)
            : defaultCardRenderer(item, isSelected, index);
        })
      ) : (
        <div className="text-center py-12">
          <i className="fa-regular fa-face-frown text-4xl text-neutral-400 dark:text-neutral-500 mb-4"></i>
          <p className="text-neutral-500 dark:text-neutral-400">{t('no_items_found')}</p>
        </div>
      )}
    </div>
  );

  // Render desktop table
  const renderTable = () => (
    <div className="overflow-auto">
      <table className="w-full text-sm rtl:text-right ltr:text-left text-neutral-800 dark:text-neutral-200">
        <thead className="text-neutral-700 uppercase border-b-2 border-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300">
          <tr>
            {showSelection && (
              <th className="py-2 px-3 w-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                    checked={data.length > 0 && selectedItems.length === data.length}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.field}
                className={`py-2 px-3 font-semibold text-nowrap ${column.className || ''}`}
              >
                <div className="flex items-center gap-1">
                  {column.icon && <i className={`fa-solid ${column.icon}`}></i>}
                  <span>{column.label}</span>
                  {sortOptions.find(opt => opt.field === column.field) && (
                    <button
                      className="ml-1"
                      onClick={() => handleSort(
                        column.field,
                        sortField === column.field && sortDirection === 'asc' ? 'desc' : 'asc'
                      )}
                    >
                      {sortField === column.field ? (
                        <i className={`fa-solid fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} text-blue-500`}></i>
                      ) : (
                        <i className="fa-solid fa-sort text-neutral-400"></i>
                      )}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => {
              const isSelected = selectedItems.includes(item[idField]);
              const customRowClass = getRowClassName ? getRowClassName(item, index, isSelected) : '';
              const defaultRowClass = index % 2 === 0 ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-neutral-50 dark:bg-neutral-900';

              return (
                <tr
                  key={item[idField]}
                  className={`transition-colors ${customRowClass || defaultRowClass} border-b border-neutral-300 dark:border-neutral-800 ${isSelected ? 'bg-blue-50 dark:bg-blue-950' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {showSelection && (
                    <td
                      className="px-3 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(item);
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                          checked={isSelected}
                          onChange={() => { }}
                        />
                      </div>
                    </td>
                  )}
                  {renderRow
                    ? renderRow(item, isSelected, handleSelect)
                    : columns.map((column, i) => (
                      <td key={i} className="px-3 py-2">
                        {column.render
                          ? column.render(item)
                          : item[column.accessor] || '-'}
                      </td>
                    ))
                  }
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-neutral-500 dark:text-neutral-400">
                <i className="fa-regular fa-face-frown"></i> {t('no_items_found')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <TableControls
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        perPage={perPage}
        totalItems={pagination ? pagination.total : data.length}
        onPerPageChange={handlePerPageChange}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        sortOptions={sortOptions}
        queryParams={queryParams}
        routeName={routeName}
        showSelection={showSelection}
      />

      {/* Render cards on mobile, table on desktop */}
      {isMobile ? renderCards() : renderTable()}

      {pagination && <Pagination links={pagination.links} />}
    </>
  );
}
