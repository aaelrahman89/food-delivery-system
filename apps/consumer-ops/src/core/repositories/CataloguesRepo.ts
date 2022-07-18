import { BranchProfileListItem } from '../models/Branch';
import {
  Catalogue,
  CatalogueForm,
  CatalogueSection,
  CatalogueSectionItem,
} from '../models/Catalogue';
import { CatalogueSectionForm } from '../models/CatalogueSection';
import { EntityId } from '@survv/commons/core/types';

export interface CataloguesRepo {
  createCatalogue(
    vendorId: EntityId,
    newCatalogue: CatalogueForm
  ): Promise<void>;
  getCatalogue(catalogueId: EntityId): Promise<Catalogue>;
  updateCatalogue(
    catalogueId: EntityId,
    updatedCatalogue: CatalogueForm
  ): Promise<void>;
  createSection(
    catalogueId: EntityId,
    catalogueSectionForm: CatalogueSectionForm
  ): Promise<void>;
  updateSection(
    catalogueId: EntityId,
    catalogueSectionId: EntityId,
    catalogueSectionForm: CatalogueSectionForm
  ): Promise<void>;
  setCatalogueAsReady(catalogueId: EntityId): Promise<void>;
  publishCatalogue(catalogueId: EntityId): Promise<void>;
  unPublishCatalogue(catalogueId: EntityId): Promise<void>;
  arrangeSections(
    catalogueId: EntityId,
    catalogueSections: CatalogueSection[]
  ): Promise<void>;
  arrangeSectionItems(
    catalogueId: EntityId,
    catalogueSectionId: EntityId,
    catalogueSectionItems: CatalogueSectionItem[]
  ): Promise<void>;
  updateBranches(
    catalogueId: EntityId,
    branches: BranchProfileListItem[]
  ): Promise<void>;
}
