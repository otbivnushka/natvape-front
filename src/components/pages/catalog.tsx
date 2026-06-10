import { PageLayout } from '@/components/shared';
import { useCategories } from '@/hooks/queries/useCategoriesQuery';
import { CatalogContainer } from '@/components/widgets';
import { PageTitle } from '@/components/shared';

const Catalog = () => {
  const { data: cats } = useCategories();

  return (
    <PageLayout>
      <PageTitle>Каталог</PageTitle>

      <CatalogContainer cats={cats ?? []} />
    </PageLayout>
  );
};

export { Catalog };
