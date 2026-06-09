import React from 'react';
import type { Address } from '@/types';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { Spinner } from '@/components/ui';

interface AdminPickupsTableProps {
  pickups: Address[];
  loading: boolean;
  onCreate: () => void;
  onDelete: (id: number) => void;
}

const AdminPickupsTable: React.FC<AdminPickupsTableProps> = ({
  pickups,
  loading,
  onCreate,
  onDelete,
}) => {
  return (
    <>
      <button
        onClick={onCreate}
        className="mb-4 flex items-center gap-2 py-2 px-4 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200"
      >
        <Plus size={16} />
        Создать точку
      </button>

      {loading ? (
        <Spinner />
      ) : pickups.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-dim gap-2">
          <MapPin size={48} className="opacity-50" />
          <span className="text-sm">Нет точек самовывоза</span>
        </div>
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted text-[13px]">
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Название</th>
                  <th className="p-3 font-semibold">Координаты</th>
                  <th className="p-3 font-semibold text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {pickups.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-none text-body">
                    <td className="p-3 text-muted">{p.id}</td>
                    <td className="p-3 font-medium">{p.label}</td>
                    <td className="p-3 text-muted text-[13px]">
                      {p.lat}, {p.lng}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
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

export { AdminPickupsTable };
