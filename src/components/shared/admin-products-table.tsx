import React, { useState } from 'react';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { Plus, Loader2, Trash2, Pencil, Package, Search } from 'lucide-react';
import { Input } from '../ui';

interface AdminProductsTableProps {
  products: Product[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AdminProductsTable: React.FC<AdminProductsTableProps> = ({
  products,
  loading,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState('');
  const [visibleOnly, setVisibleOnly] = useState(false);
  const filtered = products.filter((p) => {
    if (visibleOnly && !p.visible) return false;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <>
      <button
        onClick={onCreate}
        className="mb-4 flex items-center gap-2 py-2 px-4 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
      >
        <Plus size={16} />
        Создать товар
      </button>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={visibleOnly}
            onChange={(e) => setVisibleOnly(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Только видимые
        </label>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
          <Input
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-dim" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-dim gap-2">
          <Package size={48} className="opacity-50" />
          <span className="text-sm">Нет товаров</span>
        </div>
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted text-[13px]">
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Название</th>
                  <th className="p-3 font-semibold">Цена</th>
                  <th className="p-3 font-semibold">Категория</th>
                  <th className="p-3 font-semibold">Бренд</th>
                  <th className="p-3 font-semibold">Акция</th>
                  <th className="p-3 font-semibold text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-none text-body">
                    <td className="p-3 text-muted">{p.id}</td>
                    <td className="p-3 font-medium max-w-48 truncate">{p.name}</td>
                    <td className="p-3">{formatPrice(p.price)}</td>
                    <td className="p-3 text-muted">{p.category}</td>
                    <td className="p-3 text-muted">{p.brand}</td>
                    <td className="p-3">
                      {p.doublePrice != null ? `1+1 = ${p.doublePrice}` : '—'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => onEdit(p.id)}
                          className="p-1.5 border border-line rounded-lg text-muted cursor-pointer hover:text-body hover:border-muted transition-colors"
                          title="Редактировать"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-1.5 border border-line rounded-lg text-muted cursor-pointer hover:text-red-500 hover:border-red-300 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export { AdminProductsTable };
