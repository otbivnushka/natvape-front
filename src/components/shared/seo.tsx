import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title: string;
  description: string;
  image?: string;
};

const Seo: React.FC<SeoProps> = ({ title, description, image }: SeoProps) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />

      <meta property="og:title" content={title} />

      <meta property="og:description" content={description} />

      {image && <meta property="og:image" content={image} />}

      <meta property="og:url" content={window.location.href} />
    </Helmet>
  );
};

export { Seo };
