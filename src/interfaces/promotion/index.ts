import { ProviderInterface } from 'interfaces/provider';
import { GetQueryInterface } from 'interfaces';

export interface PromotionInterface {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  provider_id: string;
  created_at?: any;
  updated_at?: any;

  provider?: ProviderInterface;
  _count?: {};
}

export interface PromotionGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  provider_id?: string;
}
