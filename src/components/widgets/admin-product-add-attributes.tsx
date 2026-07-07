import React, { useState } from 'react';
import { Api } from '@/api';
import type { ApiCategoryAttribute } from '@/api/dto/admin.dto';
import type { ProductAttribute } from '@/types';
import { useCategoryAttributes } from '@/hooks/queries/useCategoryAttributesQuery';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface AdminProductAddAttributesProps {
  productId: number;
  categoryId: number;
  productAttributes: ProductAttribute[];
  className?: string;
}

const AdminProductAddAttributes: React.FC<AdminProductAddAttributesProps> = ({
  productId,
  categoryId,
  productAttributes,
  className,
}) => {
  const { data: definitions = [], isLoading } = useCategoryAttributes(categoryId);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const init = () => {
    const v: Record<string, string> = {};
    const m: Record<string, number> = {};
    for (const pa of productAttributes) {
      v[pa.key] = pa.value;
      m[pa.key] = pa.id;
    }
    return { values: v, map: m };
  };

  const [values, setValues] = useState<Record<string, string>>(init().values);
  const [attrIdMap, setAttrIdMap] = useState<Record<string, number>>(init().map);

  const handleSave = async (def: ApiCategoryAttribute) => {
    const value = values[def.key]?.trim() ?? '';
    if (!value) return;
    setSaving((prev) => ({ ...prev, [def.key]: true }));
    try {
      if (attrIdMap[def.key] != null) {
        await Api.admin.updateProductAttribute(attrIdMap[def.key], { value });
      } else {
        const created = await Api.admin.createProductAttribute(productId, { attributeId: def.id, value });
        if (created?.id != null) {
          setAttrIdMap((prev) => ({ ...prev, [def.key]: created.id }));
        }
      }
    } catch {
      /* silent */
    } finally {
      setSaving((prev) => ({ ...prev, [def.key]: false }));
    }
  };

  const handleDelete = async (def: ApiCategoryAttribute) => {
    if (attrIdMap[def.key] == null) return;
    setSaving((prev) => ({ ...prev, [def.key]: true }));
    try {
      await Api.admin.deleteProductAttribute(attrIdMap[def.key]);
      setAttrIdMap((prev) => {
        const next = { ...prev };
        delete next[def.key];
        return next;
      });
      setValues((prev) => ({ ...prev, [def.key]: '' }));
    } catch {
      /* silent */
    } finally {
      setSaving((prev) => ({ ...prev, [def.key]: false }));
    }
  };

  if (isLoading || definitions.length === 0) return null;

  return (
    <div className={clsx('bg-surface rounded-xl p-5', className)}>
      <h2 className="text-sm font-semibold text-muted mb-4">
        Атрибуты ({definitions.length})
      </h2>
      <div className="flex flex-col gap-3">
        {definitions.map((def) => {
          const hasValue = attrIdMap[def.key] != null;
          return (
            <div key={def.id} className="flex flex-col gap-2">
              <span className="text-sm text-body">{def.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type={def.type === 'number' ? 'number' : 'text'}
                  placeholder={def.required ? 'обязательно' : 'опционально'}
                  value={values[def.key] ?? ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [def.key]: e.target.value }))
                  }
                  className="flex-1 min-w-0 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
                />
                <button
                  onClick={() => handleSave(def)}
                  disabled={saving[def.key] || !values[def.key]?.trim()}
                  className="shrink-0 py-2 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed min-w-16"
                >
                  {saving[def.key] ? (
                    <Loader2 size={12} className="animate-spin mx-auto" />
                  ) : hasValue ? (
                    'Обновить'
                  ) : (
                    'Добавить'
                  )}
                </button>
                {hasValue && (
                  <button
                    onClick={() => handleDelete(def)}
                    disabled={saving[def.key]}
                    className="shrink-0 py-2 px-3 border border-line rounded-lg text-xs text-muted cursor-pointer hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { AdminProductAddAttributes };
