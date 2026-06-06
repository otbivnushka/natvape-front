import { Api } from '@/api';
import type { ColorForm, ProductForm } from '@/types';
import clsx from 'clsx';
import React, { useState } from 'react';
import { QuantityStepper } from '../ui';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface AdminProductAddColorsProps {
  productId: number;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  className?: string;
}

const AdminProductAddColors: React.FC<AdminProductAddColorsProps> = ({
  productId,
  form,
  setForm,
  className,
}) => {
  const [newColor, setNewColor] = useState<ColorForm>({ name: '', hex: '#000000', stock: 0 });
  const [colorAdding, setColorAdding] = useState(false);
  const handleColorStockChange = async (colorId: number, newStock: number) => {
    if (newStock < 0) return;
    try {
      await Api.admin.updateColor(colorId, { stock: newStock });
      setForm((prev) => ({
        ...prev,
        colors: prev.colors?.map((c) => (c.id === colorId ? { ...c, stock: newStock } : c)) ?? [],
      }));
    } catch {
      /* silent */
    }
  };

  const handleAddColor = async () => {
    if (!newColor.name || !newColor.hex || productId == null) return;
    setColorAdding(true);
    try {
      await Api.admin.createColor(productId, newColor);
      setForm((prev) => ({
        ...prev,
        colors: [...(prev.colors ?? []), { ...newColor }],
      }));
      setNewColor({ name: '', hex: '#000000', stock: 0 });
    } catch {
      /* silent */
    } finally {
      setColorAdding(false);
    }
  };

  const handleDeleteColor = async (colorId: number) => {
    try {
      await Api.admin.deleteColor(colorId);
      setForm((prev) => ({
        ...prev,
        colors: prev.colors?.filter((c) => c.id !== colorId) ?? [],
      }));
    } catch {
      /* silent */
    }
  };

  return (
    <div className={clsx('bg-surface rounded-xl p-5', className)}>
      <h2 className="text-sm font-semibold text-muted mb-4">Цвета ({form.colors?.length ?? 0})</h2>

      {form.colors && form.colors.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {(form.colors as (ColorForm & { id?: number })[]).map((c, i) => (
            <div
              key={c.id ?? i}
              className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 text-sm text-body"
            >
              <span
                className="w-4 h-4 rounded border border-line shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-medium min-w-20">{c.name}</span>
              <span className="text-muted">{c.hex}</span>
              {c.id != null ? (
                <QuantityStepper
                  quantity={c.stock}
                  onDecrement={() => handleColorStockChange(c.id!, c.stock - 1)}
                  onIncrement={() => handleColorStockChange(c.id!, c.stock + 1)}
                  size="sm"
                />
              ) : (
                <span className="text-dim">stock: {c.stock}</span>
              )}
              <button
                onClick={() => c.id != null && handleDeleteColor(c.id)}
                className="ml-auto p-1 rounded text-muted cursor-pointer hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <input
          placeholder="Название"
          value={newColor.name}
          onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
          className="flex-1 min-w-24 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
        />
        <input
          type="color"
          value={newColor.hex}
          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
          className="w-10 h-9 p-0.5 bg-page border border-line rounded-lg cursor-pointer"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newColor.stock || ''}
          onChange={(e) => setNewColor({ ...newColor, stock: Number(e.target.value) })}
          className="w-20 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
        />
        <button
          onClick={handleAddColor}
          disabled={colorAdding || !newColor.name}
          className="flex items-center gap-1 py-2 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {colorAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Добавить
        </button>
      </div>
    </div>
  );
};

export { AdminProductAddColors };
