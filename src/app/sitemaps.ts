import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://siakadmdtasafinatussalam.netlify.app/',
      lastModified: new Date(),
    },
    {
      url: 'https://siakadmdtasafinatussalam.netlify.app/login',
      lastModified: new Date(),
    },
    {
      url: 'https://siakadmdtasafinatussalam.netlify.app/dashboard',
      lastModified: new Date(),
    },
  ];
}