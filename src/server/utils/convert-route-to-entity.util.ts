const mapping: Record<string, string> = {
  contents: 'content',
  promotions: 'promotion',
  providers: 'provider',
  reviews: 'review',
  subscribers: 'subscriber',
  users: 'user',
  watchlists: 'watchlist',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
