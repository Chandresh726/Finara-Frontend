export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Finara - AI-Powered Financial Portfolio Platform',
    'description': 'The Future of Investing — AI-Powered Portfolios with advanced analytics, personalized recommendations, and real-time market insights',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'screenshot': '/screenshots/dashboard.jpg',
    'featureList': 'AI-powered investment recommendations, Portfolio analytics, Real-time market insights',
    'author': {
      '@type': 'Organization',
      'name': 'Finara',
      'url': 'https://finara.com'
    },
    'provider': {
      '@type': 'Organization',
      'name': 'Finara',
      'url': 'https://finara.com'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
