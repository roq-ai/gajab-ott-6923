import { ContentInterface } from 'interfaces/content';
import { PromotionInterface } from 'interfaces/promotion';
import { SubscriberInterface } from 'interfaces/subscriber';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ProviderInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  content?: ContentInterface[];
  promotion?: PromotionInterface[];
  subscriber?: SubscriberInterface[];
  user?: UserInterface;
  _count?: {
    content?: number;
    promotion?: number;
    subscriber?: number;
  };
}

export interface ProviderGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
