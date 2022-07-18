<template>
  <vg-content :pm="pm" :title="$t('APP_MANAGEMENT_APPLICATION')">
    <div class="app-management">
      <section :class="{ disabled: editMode }">
        <domain-selector
          :domain="pm.vendorType"
          @change:domain="pm.onChangeVendorType($event)"
        />
      </section>

      <section>
        <router-view
          :sections="sections"
          :disable-save-layout-changes="pm.disableSaveLayoutChanges"
          @remove:section="pm.removeSection($event)"
          @open:section-creation="pm.openSectionCreation()"
          @arrange:sections="pm.onSectionsOrderChanged($event)"
          @save-layout-changes="saveLayoutChanges"
        />
      </section>

      <section
        v-if="shouldShowManageDataSection"
        :class="{ disabled: editMode }"
      >
        <manage-data
          :tags="domainTags[this.$route.params.vendorType.toUpperCase()]"
        >
        </manage-data>
      </section>
    </div>
    <homepage-section-form
      :open="pm.shouldOpenSectionForm"
      :pm="pm.sectionFormPM"
      @discard="pm.closeSectionForm()"
      @backdrop="pm.closeSectionForm()"
      @submit="pm.onSectionFormSubmit()"
    >
    </homepage-section-form>
  </vg-content>
</template>

<script>
import DomainSelector from './DomainSelector.vue';
import HomepageSectionForm from './HomepageSectionForm.vue';
import ManageData from './ManageData.vue';
import { AppManagementPM } from '../../../../core/presentation-models/online-ordering/AppManagementPM';
import { HomepageSectionCreationPM } from '../../../../core/presentation-models/online-ordering/HomepageSectionCreationPM';
import { HomepageSectionsRepoImpl } from '../../../repositories/online-ordering/HomepageSectionsRepoImpl';
import {
  SVG_TAG_GROUP,
  SVG_TAG_TYPE_ALLERGIES,
  SVG_TAG_TYPE_CUISINE,
  SVG_TAG_TYPE_DIETARY,
  SVG_TAG_TYPE_PICKUP,
  SVG_TAG_TYPE_VENUE,
} from '@survv/assets';
import { TagType } from '../../../../core/models/TagType';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'ApplicationManagementView',
  components: {
    ManageData,
    DomainSelector,
    VgContent,
    HomepageSectionForm,
  },
  data() {
    return {
      pm: new AppManagementPM({
        homepageSectionsRepo: new HomepageSectionsRepoImpl(),
        notificationService,
        vendorType: this.$route.params.vendorType.toUpperCase(),
        children: {
          sectionCreationPM: new HomepageSectionCreationPM({
            homepageSectionsRepo: new HomepageSectionsRepoImpl(),
            vendorType: this.$route.params.vendorType.toUpperCase(),
            notificationService,
          }),
        },
      }),
    };
  },
  computed: {
    editMode() {
      return (
        this.$route.name == 'routes.online_ordering.application.sections.edit'
      );
    },
    sections() {
      return this.pm.appHomepage.sections?.map((section) => {
        return {
          id: section.id,
          name: this.$t(section.name),
          pairs: {
            HOMEPAGE_SECTION_TYPE: this.$t(section.type),
            HOMEPAGE_SECTION_CONTENT_CRITERIA: this.$t(section.contentCriteria),
            HOMEPAGE_SECTION_HEADER_TYPE: this.$t(section.headerType),
            HOMEPAGE_SECTION_STATUS: this.$t(section.status),
          },
        };
      });
    },
    domainTags() {
      return {
        FOOD: [
          {
            title: 'MANAGE_DATA_CUISINES',
            icon: SVG_TAG_TYPE_CUISINE,
            route: {
              name: 'routes.online_ordering.application.tags.list',
              params: {
                vendorType: VendorType.FOOD.valueOf().toLowerCase(),
                tagType: TagType.values.CUISINE.toLowerCase(),
              },
            },
          },
          {
            title: 'MANAGE_DATA_DIETARY',
            icon: SVG_TAG_TYPE_DIETARY,
            route: {
              name: 'routes.online_ordering.application.tags.list',
              params: {
                vendorType: VendorType.FOOD.valueOf().toLowerCase(),
                tagType: TagType.values.DIETARY.toLowerCase(),
              },
            },
          },
          {
            title: 'MANAGE_DATA_VENUE',
            icon: SVG_TAG_TYPE_VENUE,
            route: {
              name: 'routes.online_ordering.application.tags.list',
              params: {
                vendorType: VendorType.FOOD.valueOf().toLowerCase(),
                tagType: TagType.values.VENUE.toLowerCase(),
              },
            },
          },
          {
            title: 'MANAGE_DATA_ALLERGIES',
            icon: SVG_TAG_TYPE_ALLERGIES,
            route: {
              name: 'routes.online_ordering.application.tags.list',
              params: {
                vendorType: VendorType.FOOD.valueOf().toLowerCase(),
                tagType: TagType.values.ALLERGY.toLowerCase(),
              },
            },
          },
          {
            title: 'MANAGE_DATA_TAG_GROUPS',
            icon: SVG_TAG_GROUP,
            route: {
              name: 'routes.online_ordering.application.tag-groups',
            },
          },
          {
            title: 'MANAGE_DATA_PICKUP',
            icon: SVG_TAG_TYPE_PICKUP,
            route: {
              name: 'routes.online_ordering.application.tags.list',
              params: {
                vendorType: VendorType.FOOD.valueOf().toLowerCase(),
                tagType: TagType.values.PICKUP.toLowerCase(),
              },
            },
          },
        ],
        SURVV_SHOP: [
          {
            title: 'MANAGE_DATA_TAG_GROUPS',
            icon: SVG_TAG_GROUP,
            route: {
              name: 'routes.online_ordering.application.tag-groups',
            },
          },
        ],
      };
    },
    shouldShowManageDataSection() {
      if (this.domainTags[this.$route.params.vendorType.toUpperCase()])
        return (
          this.domainTags[this.$route.params.vendorType.toUpperCase()].length >
          0
        );

      return false;
    },
  },
  watch: {
    'pm.vendorType': function vendorTypeWatcher(value) {
      this.$router.push({
        params: { ...this.$route.params, vendorType: value.toLowerCase() },
      });
    },
    '$route.params.vendorType': function vendorTypeUrlWatcher(value) {
      this.pm.onChangeVendorType(value?.toUpperCase());
    },
  },

  created() {
    this.pm.init();
  },
  methods: {
    async saveLayoutChanges() {
      if (await this.pm.saveLayoutChanges())
        await this.$router.push({
          name: 'routes.online_ordering.application.view',
          params: { ...this.$route.params },
        });
    },
  },
};
</script>

<style scoped lang="scss">
section {
  margin-bottom: var(--inset-mid);
}
</style>
