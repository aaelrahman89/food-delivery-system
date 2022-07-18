<template>
  <vg-panel :title="$t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_HEADER')">
    <div>
      <div class="branch-listing__header">
        <div class="branch-listing__header__filter">
          <vg-text-field
            v-model="pm.filter.label"
            class="branch-listing__header__filter__search-field"
            type="text"
            label="ONLINE_ORDERING_BRANCHES_LISTING_TABLE_SEARCH_LABEL"
            hide-details
            clearable
            outlined
          />
          <vg-button color="primary" large @click="pm.onFilterUpdate()">
            {{ $t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_FILTER') }}
          </vg-button>
        </div>
        <vg-button color="primary" outlined @click="createBranch()">
          {{ $t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_CREATE_BRANCH') }}
        </vg-button>
      </div>
      <div class="branch-listing__table">
        <vg-data-table
          :columns="columns"
          :items="pm.branches.items"
          :skip="pm.query.skip"
          :limit="pm.query.limit"
          :sort="pm.query.sort"
          :total-items-count="pm.branches.totalItemsCount"
          @update:pagination="pm.onPaginationUpdate($event)"
          @update:sort="pm.onSortUpdate($event)"
        >
          <template #item="items">
            <tr @click="branchDetails(items.item.id)">
              <td>
                {{ items.item.label }}
              </td>
              <td>
                <v-chip outlined label color="primary">
                  {{ items.item.posIntegrationType }}
                </v-chip>
              </td>
              <td>
                <div
                  v-if="items.item.active"
                  class="
                    branch-listing__table__label
                    branch-listing__table__label__green
                  "
                >
                  {{ $t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_ENABLED') }}
                </div>
                <div
                  v-else
                  class="
                    branch-listing__table__label
                    branch-listing__table__label__red
                  "
                >
                  {{ $t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_DISABLED') }}
                </div>
              </td>
              <td @click.stop>
                <vg-action-menu :actions="generateActions(items.item.id)" />
                <!-- v-if="showActions" -->
              </td>
            </tr>
          </template>
        </vg-data-table>
      </div>
    </div>
    <vg-dialog
      :open="pm.shouldOpenBranchCodeDialog"
      :loading="pm.loading"
      :persistent="pm.loading"
      no-actions
      @update:open="pm.shouldOpenBranchCodeDialog = false"
    >
      <template #title>
        <h2>
          {{ $t('ONLINE_ORDERING_BRANCHES_LISTING_CODE_DIALOG_HEADER') }}
        </h2>
      </template>
      {{
        $t('ONLINE_ORDERING_BRANCHES_LISTING_CODE_DIALOG_BODY', {
          branchCode: pm.branchCode,
        })
      }}
    </vg-dialog>
  </vg-panel>
</template>

<script lang="ts">
import VgDialog from '../../../../components/VgDialog.vue';
import Vue from 'vue';
import { BranchListingPM } from '../../../../../core/presentation-models/branches/BranchListingPM';
import { BranchRepoImpl } from '../../../../repositories/restaurants/branches/BranchRepoImpl';
import { ROUTE_NAMES } from '../../../../../core/routes/routeNames';
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgDataTable } from '@survv/commons/components/VgDataTable';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'BranchListingTable',
  components: {
    VgPanel,
    VgDataTable,
    VgTextField,
    VgActionMenu,
    VgButton,
    VgDialog,
  },
  props: {
    showActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pm: new BranchListingPM({
        vendorId: parseInt(this.$route.params.vendorId, 10),
        query: this.$parseJSONQuery(this.$route.query.q),
        branchRepo: new BranchRepoImpl(),
        notificationService,
      }),
      columns: [
        {
          value: 'fullName',
          text: this.$t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_LABEL'),
          sortable: false,
        },
        {
          value: 'posIntegrated',
          text: this.$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION_TYPE'),
          sortable: false,
        },
        {
          value: 'email',
          text: this.$t('ONLINE_ORDERING_BRANCHES_LISTING_TABLE_STATUS'),
          sortable: false,
        },
        {
          value: '',
          text: '',
          sortable: false,
        },
      ],
    };
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    async branchDetails(branchId: number): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_DETAILS,
        params: {
          ...this.$route.params,
          branchId: branchId.toString(),
        },
      });
    },
    async createBranch(): Promise<void> {
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_BRANCHES_CREATION,
        params: {
          ...this.$route.params,
        },
      });
    },
    generateActions(branchId: string) {
      return [
        {
          name: this.$t(
            'ONLINE_ORDERING_BRANCHES_LISTING_TABLE_SHOW_ACCESS_CODE'
          ),
          onClick: async (): Promise<void> => {
            await this.pm.showAccessCode(parseInt(branchId, 10));
          },
        },
      ];
    },
  },
});
</script>

<style scoped lang="scss">
.branch-listing {
  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: var(--inset-large);

    &__filter {
      display: flex;
      flex-direction: row;
      gap: var(--inset-large);
    }
  }
  &__table {
    &__label {
      border-radius: 4px;
      font-size: var(--font-size-small);
      color: white;
      padding: 4px 8px 4px 8px;
      width: max-content;
      &__green {
        background-color: #4f8e0b;
      }
      &__red {
        background-color: #e71a1a;
      }
    }
  }
}
</style>
