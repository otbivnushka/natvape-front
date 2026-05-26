import React from 'react';
import type { AdminOrder } from '../../api/dto/admin.dto';
import { Loader2, Check, Trash2, ShoppingBag, Info } from 'lucide-react';

interface AdminOrdersTableProps {
  orders: AdminOrder[];
  loading: boolean;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  orders,
  loading,
  onComplete,
  onDelete,
}) => {
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-dim" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-dim gap-2">
          <ShoppingBag size={48} className="opacity-50" />
          <span className="text-sm">Нет новых заказов</span>
        </div>
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted text-[13px]">
                  <th className="p-3 font-semibold">ID</th>
                  <th className="p-3 font-semibold">Пользователь</th>
                  <th className="p-3 font-semibold">Сумма</th>
                  <th className="p-3 font-semibold">Способ</th>
                  <th className="p-3 font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-none text-body">
                    <td className="p-3 text-muted">{o.id}</td>
                    <td className="p-3 max-w-36 truncate">{o.user.name}</td>
                    <td className="p-3 font-medium">{o.total}</td>
                    <td className="p-3 text-muted">
                      {o.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => o.id}
                          className="flex items-center gap-1 py-1.5 px-2.5 border-none rounded-lg bg-primary text-on-accent text-[12px] font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
                        >
                          <Info size={12} />
                        </button>
                        <button
                          onClick={() => onComplete(o.id)}
                          className="flex items-center gap-1 py-1.5 px-2.5 border-none rounded-lg bg-accent text-on-accent text-[12px] font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => onDelete(o.id)}
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

export { AdminOrdersTable };
