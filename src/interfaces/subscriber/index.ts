import { ReviewInterface } from 'interfaces/review';
import { WatchlistInterface } from 'interfaces/watchlist';
import { UserInterface } from 'interfaces/user';
import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface SubscriberInterface {
  id?: string;
  user_id: string;
  provider_id: string;
  created_at?: any;
  updated_at?: any;
  review?: ReviewInterface[];
  watchlist?: WatchlistInterface[];
  user?: UserInterface;
  provider?: ProviderInterface;
  _count?: {
    review?: number;
    watchlist?: number;
  };
}

export interface SubscriberGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  provider_id?: string;
}
