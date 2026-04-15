export const environment = {
  production: false,
  version: '1.0.0',
  pwa: {
    enabled: true,
    promptEnabled: true,
    promptInterval: 30, // days
  },
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    preloadComponents: true,
  },
  api: {
    baseUrl: 'http://localhost:4000/api',
    timeout: 10000,
  },
  seo: {
    title: 'Sobin Varghese - Frontend Developer Portfolio',
    description: 'Experienced Frontend Developer specializing in Angular, React, and responsive web development.',
    author: 'Sobin Varghese',
    keywords: ['Frontend Developer', 'Angular', 'React', 'Web Development', 'UI/UX', 'Responsive Design'],
    baseUrl: 'https://your-portfolio-url.com',
    ogImage: 'assets/og-image.jpg',
  }
};