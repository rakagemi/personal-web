import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pancidiuw.vercel.app', // Wajib pakai https:// dan hilangkan www
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}