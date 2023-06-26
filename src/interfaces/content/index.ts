import { ReviewInterface } from 'interfaces/review';
import { WatchlistInterface } from 'interfaces/watchlist';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface ContentInterface {
  id?: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  provider_id: string;
  created_at?: any;
  updated_at?: any;
  review?: ReviewInterface[];
  watchlist?: WatchlistInterface[];
  provider?: ProviderInterface;
  _count?: {
    review?: number;
    watchlist?: number;
  };
}

export interface ContentGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  url?: string;
  provider_id?: string;
}
