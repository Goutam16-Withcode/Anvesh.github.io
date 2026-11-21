import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anvesh.ai';
  const now = new Date();

  const routes = [
    '',
    '/dashboard',
    '/jobs',
    '/what-if',
    '/skill-graph',
    '/skill-gap',
    '/career-path',
    '/career-twin',
    '/compare-jobs',
    '/market-trends',
    '/resume-builder',
    '/roadmap',
    '/profile',
    '/profile/review',
    '/login',
    '/signup',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/jobs' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/jobs' || route === '/dashboard' ? 0.9 : 0.8,
  }));
}
