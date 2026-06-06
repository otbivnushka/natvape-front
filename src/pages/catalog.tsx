import { PageLayout } from '../components/shared';
import { useApiData } from '../hooks/useApiData';
import { Api } from '../api';
import { CatalogContainer } from '../components/shared/catalog-container';
import { PageTitle } from '../components/shared/page-title';

const Catalog = () => {
  const { data: cats } = useApiData(() => Api.categories.getAll(), []);

  return (
    <PageLayout>
      <PageTitle>Каталог</PageTitle>

      <CatalogContainer cats={cats} />
    </PageLayout>
  );
};

export default Catalog;
