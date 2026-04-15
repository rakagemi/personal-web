import { ENV } from '@/utils/environment'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${ENV.url}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}