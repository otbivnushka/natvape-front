import type { ProductForm, VariantForm } from '@/types';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Input, QuantityStepper } from '../ui';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Api } from '@/api';
import { transliterate } from '@/utils/transliterate';

interface AdminProductAddVariantsProps {
  productId: number;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  className?: string;
}

const AdminProductAddVariants: React.FC<AdminProductAddVariantsProps> = ({
  productId,
  form,
  setForm,
  className,
}) => {
  const [variantAdding, setVariantAdding] = useState(false);
  const [newVariant, setNewVariant] = useState<VariantForm>({ name: '', value: '', stock: 0 });
  const handleAddVariant = async () => {
    if (!newVariant.name || !newVariant.value || productId == null) return;
    setVariantAdding(true);
    try {
      await Api.admin.createVariant(productId, newVariant);
      setForm((prev) => ({
        ...prev,
        variants: [...(prev.variants ?? []), { ...newVariant }],
      }));
      setNewVariant({ name: '', value: '', stock: 0 });
    } catch {
      /* silent */
    } finally {
      setVariantAdding(false);
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    try {
      await Api.admin.deleteVariant(variantId);
      setForm((prev) => ({
        ...prev,
        variants: prev.variants?.filter((v) => v.id !== variantId) ?? [],
      }));
    } catch {
      /* silent */
    }
  };

  const handleVariantStockChange = async (variantId: number, newStock: number) => {
    if (newStock < 0) return;
    try {
      await Api.admin.updateVariant(variantId, { stock: newStock });
      setForm((prev) => ({
        ...prev,
        variants:
          prev.variants?.map((v) => (v.id === variantId ? { ...v, stock: newStock } : v)) ?? [],
      }));
    } catch {
      /* silent */
    }
  };

  return (
    <div className={clsx('bg-surface rounded-xl p-5', className)}>
      <h2 className="text-sm font-semibold text-muted mb-4">
        Варианты ({form.variants?.length ?? 0})
      </h2>
      {form.variants && form.variants.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {(form.variants as (VariantForm & { id?: number })[]).map((v, i) => (
            <div
              key={v.id ?? i}
              className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 text-sm text-body"
            >
              <span className="font-medium min-w-20">{v.name}</span>
              <span className="text-muted min-w-20">{v.value}</span>

              <QuantityStepper
                quantity={v.stock}
                onDecrement={() => handleVariantStockChange(v.id!, v.stock - 1)}
                onIncrement={() => handleVariantStockChange(v.id!, v.stock + 1)}
                size="sm"
              />

              <button
                onClick={() => v.id != null && handleDeleteVariant(v.id)}
                className="ml-auto p-1 rounded text-muted cursor-pointer hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Название"
          value={newVariant.name}
          onChange={(e) =>
            setNewVariant({
              ...newVariant,
              name: e.target.value,
              value: transliterate(e.target.value),
            })
          }
          className="flex-1 min-w-24 border text-sm "
        />
        <Input
          placeholder="Значение"
          value={newVariant.value}
          onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
          className="flex-1 min-w-24 border text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
        />
        <Input
          type="number"
          placeholder="Stock"
          value={newVariant.stock || ''}
          onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
          className="w-20 border text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
        />
        <button
          onClick={handleAddVariant}
          disabled={variantAdding || !newVariant.name || !newVariant.value}
          className="flex items-center gap-1 py-2 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {variantAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Добавить
        </button>
      </div>
    </div>
  );
};

export { AdminProductAddVariants };
