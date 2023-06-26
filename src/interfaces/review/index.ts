import { SubscriberInterface } from 'interfaces/subscriber';
import { ContentInterface } from 'interfaces/content';
import { GetQueryInterface } from 'interfaces';

export interface ReviewInterface {
  id?: string;
  rating: number;
  comment?: string;
  subscriber_id: string;
  content_id: string;
  created_at?: any;
  updated_at?: any;

  subscriber?: SubscriberInterface;
  content?: ContentInterface;
  _count?: {};
}

export interface ReviewGetQueryInterface extends GetQueryInterface {
  id?: string;
  comment?: string;
  subscriber_id?: string;
  content_id?: string;
}
