export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Finlerk',
  description:
    'Beautifully designed components built with Radix UI and Tailwind CSS.',
  navigation: [
    {
      title: 'News',
      href: '/news',
    },
    {
      title: 'Stocks',
      href: '/stocks',
    },
  ],
  links: {
    github: 'https://github.com/davidkapuza/finlerk',
  },
};
