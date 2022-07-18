import { ErrandCategory } from '../models/ErrandCategory';
import { ItemsList } from '@survv/commons/core/models/ItemsList';
import { ListingQuery } from '@survv/commons/core/models/Query';

export interface ErrandCategoriesRepo {
  listCategories(query?: ListingQuery): Promise<ItemsList<ErrandCategory>>;
}
