import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Api } from '../api';
import type { ApiCategoryInfo } from '../api/dto/category.dto';
import type { CreateProductDto } from '../api/dto/admin.dto';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { ImageUpload, Input } from '../components/ui';

interface VariantForm {
  id?: number;
  name: string;
  value: string;
  stock: number;
}

interface ColorForm {
  id?: number;
  name: string;
  hex: string;
  stock: number;
}

interface ProductForm extends Omit<CreateProductDto, 'variants' | 'colors' | 'imageId'> {
  imageId: number | null;
  variants: VariantForm[];
  colors: ColorForm[];
}

const AdminProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isNew = id === 'new';

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/profile', { replace: true });
    }
  }, []);

  const [productId, setProductId] = useState<number | null>(isNew ? null : Number(id));
  const [categories, setCategories] = useState<ApiCategoryInfo[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [previewUrl, setPreviewUrl] = useState('');

  const [form, setForm] = useState<ProductForm>({
    name: '',
    categoryId: 0,
    price: 0,
    doublePrice: null,
    imageId: null,
    description: '',
    brand: '',
    badge: null,
    variantLabel: '',
    variants: [],
    colors: [],
  });

  const [newVariant, setNewVariant] = useState<VariantForm>({ name: '', value: '', stock: 0 });
  const [newColor, setNewColor] = useState<ColorForm>({ name: '', hex: '#000000', stock: 0 });
  const [variantAdding, setVariantAdding] = useState(false);
  const [colorAdding, setColorAdding] = useState(false);

  useEffect(() => {
    Api.categories
      .getAll()
      .then((cats) => {
        setCategories(cats);
        if (isNew) {
          setForm((prev) => ({ ...prev, categoryId: cats[0]?.id ?? 0 }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (productId == null) return;
    setLoading(true);
    Promise.all([Api.products.getById(productId)])
      .then(([apiProduct]) => {
        const cat = categories.find((c) => c.key === apiProduct.category.key);
        setForm({
          name: apiProduct.name,
          categoryId: cat?.id ?? 0,
          price: apiProduct.price,
          doublePrice: apiProduct.doublePrice ?? null,
          imageId: apiProduct.imageId,
          description: apiProduct.description,
          brand: apiProduct.brand,
          badge: apiProduct.badge ?? null,
          variantLabel: apiProduct.variantLabel,
          variants: apiProduct.variants?.map((v) => ({ ...v })) ?? [],
          colors: apiProduct.colors?.map((c) => ({ ...c })) ?? [],
        });
        setPreviewUrl(apiProduct.image);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId, categories]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (productId != null) {
        await Api.admin.updateProduct(productId, form);
      } else {
        const created = await Api.admin.createProduct(form);
        setProductId(created.id);
        window.history.replaceState(null, '', `/admin/products/${created.id}`);
      }
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-dim" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-2xl mx-auto px-4 pb-16 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">
            {isNew ? 'Создать товар' : `Редактировать товар #${productId}`}
          </h1>
          <button
            onClick={() => navigate('/admin')}
            className="py-1.5 px-3 border border-line rounded-lg bg-surface text-sm text-muted cursor-pointer hover:bg-page transition-colors"
          >
            Назад
          </button>
        </div>

        <div className="bg-surface rounded-xl p-5 mb-6">
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
                className="flex-1 bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Цена"
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="1+1 цена"
                value={form.doublePrice ?? ''}
                onChange={(e) =>
                  setForm({ ...form, doublePrice: e.target.value ? Number(e.target.value) : null })
                }
              />
              <Input
                placeholder="Текст акции"
                value={form.badge ?? ''}
                onChange={(e) => setForm({ ...form, badge: e.target.value || null })}
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
            <textarea
              placeholder="Описание"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary placeholder:text-dim resize-none"
            />
            <Input
              placeholder="Название варианта (напр. Вкус)"
              value={form.variantLabel ?? ''}
              onChange={(e) => setForm({ ...form, variantLabel: e.target.value || undefined })}
              className="w-full bg-page border border-line rounded-lg px-3.5 py-2.5 text-sm text-body outline-none transition-colors duration-150 focus:border-primary placeholder:text-dim"
            />
          </div>
        </div>

        {productId != null && (
          <>
            <div className="bg-surface rounded-xl p-5 mb-6">
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
                      <span className="text-dim">stock: {v.stock}</span>
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
                <input
                  placeholder="Название"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  className="flex-1 min-w-24 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
                />
                <input
                  placeholder="Значение"
                  value={newVariant.value}
                  onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
                  className="flex-1 min-w-24 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newVariant.stock || ''}
                  onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                  className="w-20 bg-page border border-line rounded-lg px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary placeholder:text-dim"
                />
                <button
                  onClick={handleAddVariant}
                  disabled={variantAdding || !newVariant.name || !newVariant.value}
                  className="flex items-center gap-1 py-2 px-3 border-none rounded-lg bg-primary text-on-primary text-xs font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {variantAdding ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Plus size={12} />
                  )}
                  Добавить
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-5 mb-6">
              <h2 className="text-sm font-semibold text-muted mb-4">
                Цвета ({form.colors?.length ?? 0})
              </h2>

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
                      <span className="text-dim">stock: {c.stock}</span>
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
                  {colorAdding ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Plus size={12} />
                  )}
                  Добавить
                </button>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.price}
          className="w-full py-3 border-none rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? 'Сохранение...' : productId != null ? 'Сохранить изменения' : 'Создать товар'}
        </button>
      </div>
    </div>
  );
};

export default AdminProduct;
