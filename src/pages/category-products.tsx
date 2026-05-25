import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, SearchX } from 'lucide-react';
import { Api } from '../api';
import type { ApiCategoryInfo } from '../api/dto/category.dto';
import type { SortOption, Product } from '../types';
import { SearchBar, SortSelect, PriceFilter, BrandFilter, Skeleton } from '../components/ui';
import { ProductCard, EmptyState, PageLayout } from '../components/shared';

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [globalMinPrice, setGlobalMinPrice] = useState(0);
  const [globalMaxPrice, setGlobalMaxPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [catInfo, setCatInfo] = useState<ApiCategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  useEffect(() => {
    Api.categories.getAll().then((cats) => {
      const found = cats.find((c) => c.key === category);
      setCatInfo(found ?? null);
    }).catch(() => {});
  }, [category]);

  useEffect(() => {
    if (!category) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      Api.products.getAll({
        category,
        search: search || undefined,
        sort: sort !== 'name' ? sort : undefined,
        brand: brand || undefined,
        priceMin: minPrice > 0 ? minPrice : undefined,
        priceMax: maxPrice > 0 ? maxPrice : undefined,
        limit: 50,
      }),
      Api.products.getBrands(category).catch(() => [] as string[]),
    ])
      .then(([res, brandsList]) => {
        const mapped = res.items.map(Api.products.mapProduct);
        Api.productCache.set(mapped);
        setProducts(mapped);
        setBrands(brandsList);
        if (res.items.length > 0 && initialLoad.current) {
          initialLoad.current = false;
          const prices = res.items.map((p) => p.price);
          const gMin = Math.min(...prices);
          const gMax = Math.max(...prices);
          setGlobalMinPrice(gMin);
          setGlobalMaxPrice(gMax);
          setMinPrice(gMin);
          setMaxPrice(gMax);
        }
      })
      .catch(() => {
        setProducts([]);
        setBrands([]);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, brand, minPrice, maxPrice]);

  const handleBack = () => navigate('/');

  if (!category || (!loading && !catInfo)) {
    return (
      <PageLayout>
        <EmptyState
          icon={<HelpCircle size={48} />}
          title="Категория не найдена"
          description="Попробуйте вернуться в каталог"
        />
        <button
          onClick={handleBack}
          className="mt-4 py-2.5 px-6 border-none rounded-lg bg-primary text-on-primary text-sm font-semibold cursor-pointer hover:bg-primary-hover block mx-auto"
        >
          В каталог
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-body mb-3">{catInfo?.label ?? category}</h1>

      <div className="flex gap-1.5 items-center mb-4 flex-wrap">
        <div className="flex-1 min-w-30">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <SortSelect value={sort} onChange={setSort} />
        <BrandFilter value={brand} options={brands} onChange={setBrand} />
        <PriceFilter
          min={minPrice}
          max={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
          globalMin={globalMinPrice}
          globalMax={globalMaxPrice}
        />
      </div>

      {!loading && products.length > 0 && (
        <div className="text-[12px] text-dim mb-3">
          Найдено: {products.length}{' '}
          {products.length === 1
            ? 'товар'
            : products.length < 5
              ? 'товара'
              : 'товаров'}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          <Skeleton count={6} />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<SearchX size={48} />}
          title="Ничего не найдено"
          description="Попробуйте изменить фильтры или поисковый запрос"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default CategoryProducts;
