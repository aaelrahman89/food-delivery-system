import { AppHomepage } from '../../../core/models/AppHomepage';
import { HomepageSection } from '../../../core/models/HomepageSection';
import { request } from '@survv/commons/shell/backend/backend';

export class HomepageSectionsRepoImpl {
  constructor({ networkService = { request } } = {}) {
    this._networkService = networkService;
  }

  async createHomepageSection({
    name,
    sectionType,
    contentCriteria,
    headerType,
    vendorType,
    status,
    threshold,
  }) {
    await this._networkService.request({
      requestLine: 'post /consumer/api/v1/homepage-sections',
      body: {
        title: name,
        sectionType,
        contentCriteria,
        headerType,
        vendorType,
        status,
        thresholdValue: threshold,
      },
    });
  }

  async listHomepageSections({ vendorType }) {
    const backendRequest = {
      requestLine: 'get /consumer/api/v1/homepage-sections',
      query: {
        query: {
          vgql: 'v1',
          filter: {
            elements: [
              { field: 'vendorType', operator: 'eq', value: vendorType },
            ],
          },
          sort: {
            elements: [{ field: 'order', order: 'Asc' }],
          },
        },
      },
    };

    const { homepageSections } = await this._networkService.request(
      backendRequest
    );

    return new AppHomepage(
      homepageSections.map(
        ({ id, title, sectionType, contentCriteria, headerType, status }) =>
          new HomepageSection({
            id,
            name: title,
            type: sectionType,
            contentCriteria,
            headerType,
            status,
          })
      )
    );
  }

  async arrangeSections(vendorType, sections) {
    await this._networkService.request({
      requestLine: 'post /consumer/api/v1/homepage-sections/arrange-sections',
      body: {
        vendorType,
        sections: sections.map((section) => section.id),
      },
    });
  }

  async removeHomepageSection(section) {
    await this._networkService.request({
      requestLine: 'delete /consumer/api/v1/homepage-sections/:sectionId',
      params: { sectionId: section.id },
    });
  }
}
