import { ContentCriteria } from './ContentCriteria';
import { HeaderType } from './HeaderType';
import { MultilingualString } from '@survv/commons/core/models/MultilingualString';
import { SectionStatus } from './SectionStatus';
import { SectionType } from './SectionType';

export class HomepageSection {
  constructor({ id, name, type, contentCriteria, headerType, status }) {
    this.id = id;
    this.name = new MultilingualString(name);
    this.type = new SectionType(type);
    this.contentCriteria = new ContentCriteria(contentCriteria);
    this.headerType = new HeaderType(headerType);
    this.status = new SectionStatus(status);
  }
}
