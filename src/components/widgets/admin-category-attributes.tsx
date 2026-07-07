import React, { useState } from 'react';
import { Api } from '@/api';
import type { ApiCategoryAttribute } from '@/api/dto/admin.dto';
import { useCategories } from '@/hooks/queries/useCategoriesQuery';
import { useCategoryAttributes } from '@/hooks/queries/useCategoryAttributesQuery';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const AdminCategoryAttributes: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const { data: attributes = [], isLoading } = useCategoryAttributes(selectedCategoryId);

  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [adding, setAdding] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['category-attributes', selectedCategoryId] });
  };

  const handleAdd = async () => {
    if (!newName || !newKey || selectedCategoryId == null) return;
    setAdding(true);
    try {
      await Api.admin.createCategoryAttribute({
        categoryId: selectedCategoryId,
        name: newName,
        key: newKey,
        type: 'string',
        required: false,
      });
      setNewName('');
      setNewKey('');
      invalidate();
    } catch {
      /* silent */
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await Api.admin.deleteCategoryAttribute(id);
      invalidate();
    } catch {
      /* silent */
    }
  };

  return (
    <div className="bg-surface rounded-xl p-5">
      <h2 className="text-sm font-semibold text-muted mb-4">Атрибуты категорий</h2>

      <select
        value={selectedCategoryId ?? ''}
        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)}
        className="w-full mb-4 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary"
      >
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-muted" />
        </div>
      )}

      {!isLoading && selectedCategoryId != null && attributes.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {attributes.map((attr: ApiCategoryAttribute) => (
            <div
              key={attr.id}
              className="flex items-center gap-2 bg-page rounded-lg px-3 py-2 text-sm text-body"
            >
              <span className="font-medium min-w-20">{attr.name}</span>
              <span className="text-muted min-w-20">{attr.key}</span>
              <span className="text-dim min-w-16">{attr.type}</span>
              <span className="text-dim">{attr.required ? 'обязательный' : 'опциональный'}</span>
              <button
                onClick={() => handleDelete(attr.id)}
                className="ml-auto p-1 rounded text-muted cursor-pointer hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && selectedCategoryId != null && attributes.length === 0 && (
        <p className="text-sm text-dim mb-4">Атрибутов пока нет</p>
      )}

      {selectedCategoryId != null && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            placeholder="Название"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (!newKey || newKey === newName) {
                setNewKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
              }
            }}
            className="flex-1 min-w-24 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
          />
          <input
            placeholder="Ключ"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 min-w-24 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName || !newKey}
            className="flex items-center gap-1 py-2 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export { AdminCategoryAttributes };
