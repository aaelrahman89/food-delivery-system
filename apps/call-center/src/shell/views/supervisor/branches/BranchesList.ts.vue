<template>
  <vg-content :title="$t('SUPERVISOR_BRANCHES_LIST')">
    <div class="branches-list-container">
      <div class="branches-list-container__row">
        <branches-list-filter
          :collapsible="true"
          :collapsed="false"
          :filter="message.state.filter"
          :status-list="message.state.filtersData.statusList"
          @update:filter="filtersUpdated"
        />
      </div>
      <div class="branches-list-container__row">
        <branches-list-table
          :items="message.state.list"
          :total-items-count="message.state.totalItemsCount"
          :skip="message.state.skip"
          :limit="message.state.limit"
          :sort="message.state.sort"
          :loading="tableLoading"
          @update:pagination="paginationUpdated"
          @update:sort="sortUpdated"
          @update-status="openBranchStatusForm"
        />
      </div>
      <update-branch-status-bottom-sheet
        :open="message.formStatus === 'OPENED'"
        :form="message.state.form"
        :branch-label="message.state.currentBranch.label"
        :branch-status-list="message.state.filtersData.statusList"
        @submitted="updateBranchStatus"
        @discard="closeBranchStatusForm"
        @backdrop="closeBranchStatusForm"
      />
    </div>
  </vg-content>
</template>

<script lang="ts">
import BranchesListFilter from './BranchesListFilter.ts.vue';
import BranchesListTable from './BranchesListTable.ts.vue';
import UpdateBranchStatusBottomSheet from './UpdateBranchStatusBottomSheet.ts.vue';
import Vue from 'vue';
import { BranchesRepoImpl } from '../../../repositories/branches/BranchesRepoImpl';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import {
  SupervisorBranchesListAction,
  SupervisorBranchesListMessage,
} from '../../../../core/blocs/supervisor/branches/SupervisorBranchesListMessage';
import { SupervisorBranchesListBloc } from '../../../../core/blocs/supervisor/branches/SupervisorBranchesListBloc';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'BranchesList',
  components: {
    BranchesListFilter,
    BranchesListTable,
    UpdateBranchStatusBottomSheet,
    VgContent,
  },
  data() {
    return {
      bloc: new SupervisorBranchesListBloc({
        branchesRepo: new BranchesRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      }),
      message: new SupervisorBranchesListMessage(),
    };
  },
  computed: {
    tableLoading(): boolean {
      return this.message.tableStatus === 'LOADING';
    },
  },
  created() {
    this.bloc.outbox().subscribe({
      next: (message: SupervisorBranchesListMessage) => {
        this.message = message;
      },
    });
    this.bloc.inbox().next(
      new SupervisorBranchesListAction({
        type: 'INITIALIZE',
        payload: {
          ...this.$parseJSONQuery(this.$route.query.q),
        },
      })
    );
  },
  destroyed() {
    this.bloc.dispose();
  },
  methods: {
    paginationUpdated({ skip, limit }: { skip: number; limit: number }): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
          payload: {
            skip,
            limit,
          },
        })
      );
    },
    sortUpdated(sort: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
          payload: {
            sort,
          },
        })
      );
    },
    filtersUpdated(filter: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'FETCH_BRANCHES',
          payload: {
            filter,
          },
        })
      );
    },
    openBranchStatusForm(args: { id: number; label: string }): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'OPEN_FORM',
          payload: { branchId: args.id, label: args.label },
        })
      );
    },
    closeBranchStatusForm(): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'CLOSE_FORM',
        })
      );
    },
    updateBranchStatus(status: string): void {
      this.bloc.inbox().next(
        new SupervisorBranchesListAction({
          type: 'UPDATE_BRANCH_STATUS',
          payload: {
            form: {
              status,
            },
          },
        })
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.branches-list-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: var(--inset-mid);
}
</style>
