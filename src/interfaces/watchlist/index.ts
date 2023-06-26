import { SubscriberInterface } from 'interfaces/subscriber';
import { ContentInterface } from 'interfaces/content';
import { GetQueryInterface } from 'interfaces';

export interface WatchlistInterface {
  id?: string;
  subscriber_id: string;
  content_id: string;
  created_at?: any;
  updated_at?: any;

  subscriber?: SubscriberInterface;
  content?: ContentInterface;
  _count?: {};
}

export interface WatchlistGetQueryInterface extends GetQueryInterface {
  id?: string;
  subscriber_id?: string;
  content_id?: string;
}
