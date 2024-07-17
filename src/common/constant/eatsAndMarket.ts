import router from 'next/router';

export const eatAndMarkets = {
  data: [
    {
      id: 2,
      name: 'Central Eats',
      title: 'Satisfy Your Cravings',
      slogan: 'Find the best Central restaurant in your neighborhood',
      featured_image: 'https://serino-cdn-test.serino.com/homepage-qa/centraleats.png',
      buttonLabel: 'Go to Eats',
      backgroundColor: '#F3BB2B',
      navigateTo: () => router.push('/eats'),
    },
    {
      id: 1,
      name: 'Central Market',
      slogan: 'Get the best grocery deals today!',
      title: 'Grocery Must-Haves',
      featured_image: 'https://serino-cdn-test.serino.com/homepage-qa/centralmarket.png',
      buttonLabel: 'Go to Market',
      backgroundColor: '#21BB71',
      navigateTo: () => router.push('/market'),
    },
  ],
};
