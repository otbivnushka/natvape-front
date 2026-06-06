import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Api } from '../api';
import type { ApiCategoryInfo } from '../api/dto/category.dto';
import type { SortOption, Product } from '../types';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchBar, SortSelect, PriceFilter, BrandFilter, Skeleton } from '../components/ui';
import { EmptyState, PageLayout } from '../components/shared';
import { ProductsContainer } from '../components/shared/products-container';
import { PageTitle } from '../components/shared/page-title';

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  useScrollToTop();
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
  const skipNextFetch = useRef(false);
  const debouncedSearch = useDebounce(search, 300);
  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);

  useEffect(() => {
    Api.categories
      .getAll()
      .then((cats) => {
        const found = cats.find((c) => c.key === category);
        setCatInfo(found ?? null);
      })
      .catch(() => {});
  }, [category]);

  useEffect(() => {
    if (!category) return;
    Api.products
      .getBrands(category)
      .then(setBrands)
      .catch(() => setBrands([]));
  }, [category]);

  useEffect(() => {
    if (!category) return;
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    setLoading(true);
    Api.products
      .getAll({
        category,
        search: debouncedSearch || undefined,
        sort: sort,
        brand: brand || undefined,
        priceMin: debouncedMinPrice > 0 ? debouncedMinPrice : undefined,
        priceMax: debouncedMaxPrice > 0 ? debouncedMaxPrice : undefined,
      })
      .then((res) => {
        const mapped = res.items.map(Api.products.mapProduct);
        Api.productCache.set(mapped);
        setProducts(mapped);
        if (res.items.length > 0 && initialLoad.current) {
          initialLoad.current = false;
          const prices = res.items.map((p) => p.price);
          const gMin = Math.min(...prices);
          const gMax = Math.max(...prices);
          setGlobalMinPrice(gMin);
          setGlobalMaxPrice(gMax);
          setMinPrice(gMin);
          setMaxPrice(gMax);
          skipNextFetch.current = true;
        }
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, debouncedSearch, sort, brand, debouncedMinPrice, debouncedMaxPrice]);

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
      {catInfo ? (
        <PageTitle>{catInfo.label}</PageTitle>
      ) : (
        <Skeleton className="h-8 mb-5 w-48 rounded-lg bg-muted" />
      )}

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

      <ProductsContainer products={products} loading={loading} />
    </PageLayout>
  );
};

export default CategoryProducts;
