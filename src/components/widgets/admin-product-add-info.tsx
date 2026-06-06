import clsx from 'clsx';
import React from 'react';
import { ImageUpload, Input, PrimaryButton, Textarea } from '../ui';
import { useCategories } from '@/hooks/useCategories';
import type { ProductForm } from '@/types';
import { generateProductDescription } from '@/utils/generateProductDescription';

interface AdminProductAddInfoProps {
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  previewUrl: string;
  className?: string;
}

const AdminProductAddInfo: React.FC<AdminProductAddInfoProps> = ({
  form,
  setForm,
  previewUrl,
  className,
}) => {
  const { categories } = useCategories();

  return (
    <div className={clsx('bg-surface rounded-xl p-5', className)}>
      <h2 className="text-sm font-semibold text-muted mb-4">Основная информация</h2>
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="flex gap-3">
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="flex-1 bg-surface border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <Input
            type="number"
            className="w-[calc(50%-1.5rem)]"
            placeholder="Цена"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>
        <div className="flex justify-between gap-3">
          <Input
            type="number"
            placeholder="1+1 цена"
            value={form.doublePrice ?? ''}
            className="w-[calc(50%-1.5rem)]"
            onChange={(e) =>
              setForm({ ...form, doublePrice: e.target.value ? Number(e.target.value) : null })
            }
          />
          <Input
            placeholder="Текст акции"
            value={form.badge ?? ''}
            onChange={(e) => setForm({ ...form, badge: e.target.value || null })}
            className="w-full"
          />
        </div>
        <Input
          placeholder="Бренд"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <ImageUpload
          value={form.imageId}
          previewUrl={previewUrl}
          onChange={(id) => setForm({ ...form, imageId: id })}
        />
        <Textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <PrimaryButton
          onClick={() => setForm({ ...form, description: generateProductDescription(form) })}
        >
          Авто генерейт
        </PrimaryButton>
        <Input
          placeholder="Название варианта (напр. Вкус)"
          value={form.variantLabel ?? ''}
          onChange={(e) => setForm({ ...form, variantLabel: e.target.value || undefined })}
          className="w-full bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary placeholder:text-dim"
        />
      </div>
    </div>
  );
};

export { AdminProductAddInfo };
