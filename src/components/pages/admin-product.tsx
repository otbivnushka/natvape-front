import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Api } from '@/api';
import { Loader2 } from 'lucide-react';
import { PrimaryButton, Spinner } from '@/components/ui';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { useCategories } from '@/hooks/queries/useCategoriesQuery';
import {
  AdminProductAddColors,
  AdminProductAddInfo,
  AdminProductAddVariants,
} from '@/components/widgets';
import type { ProductForm } from '@/types';

const AdminProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  useAdminGuard();
  const isNew = id === 'new';

  const [productId, setProductId] = useState<number | null>(isNew ? null : Number(id));
  const { data: categories = [] } = useCategories();
  const getByKey = (key: string) => categories.find((c) => c.key === key);
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

  useEffect(() => {
    if (isNew && categories.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({ ...prev, categoryId: categories[0]?.id ?? 0 }));
    }
  }, [isNew, categories]);

  useEffect(() => {
    if (productId == null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([Api.products.getById(productId)])
      .then(([apiProduct]) => {
        const cat = getByKey(apiProduct.category.key);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-2xl mx-auto px-4 pb-20 py-6">
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

        <AdminProductAddInfo
          form={form}
          setForm={setForm}
          previewUrl={previewUrl}
          className="mb-6"
        />

        <PrimaryButton
          onClick={handleSave}
          disabled={saving || !form.name || !form.price}
          className="mb-6 w-full py-3 border-none rounded-xl bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:opacity-85 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? 'Сохранение...' : productId != null ? 'Сохранить изменения' : 'Создать товар'}
        </PrimaryButton>

        {productId != null && (
          <>
            <AdminProductAddVariants
              productId={productId}
              form={form}
              setForm={setForm}
              className="mb-6"
            />

            <AdminProductAddColors productId={productId} form={form} setForm={setForm} />
          </>
        )}
      </div>
    </div>
  );
};

export { AdminProduct };
