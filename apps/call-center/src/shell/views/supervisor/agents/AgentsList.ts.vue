<template>
  <vg-content :title="$t('SUPERVISOR_AGENTS_LIST')">
    <div class="agents-list-container">
      <div class="agents-list-container__actions">
        <vg-button outlined @click="openUserCreationForm">
          {{ $t('SUPERVISOR_AGENTS_LIST_CREATE_AGENT') }}
        </vg-button>
      </div>
      <div class="agents-list-container__table">
        <agents-list-table
          :items="message.state.list"
          :total-items-count="message.state.totalItemsCount"
          :skip="message.state.skip"
          :limit="message.state.limit"
          :sort="message.state.sort"
          :loading="tableLoading"
          @update:pagination="paginationUpdated"
          @update:sort="sortUpdated"
          @activate-user="activateUser"
          @deactivate-user="openConfirmationDialog"
          @update-user="openUserUpdateForm"
        />
      </div>
      <div class="text-center">
        <v-dialog width="500" :value="message.dialogStatus === 'OPENED'">
          <v-card>
            <v-card-title class="text-h5 lighten-2" primary-title>
              <div class="agents-list-container__dialog__header__svg">
                <vg-svg
                  :src="SVG_ICON_WARNING"
                  fill="#E02020"
                  width="50px"
                  height="50px"
                />
              </div>
              <div class="agents-list-container__dialog__header__title">
                {{ $t('SUPERVISOR_AGENTS_LIST_DIALOG_TITLE') }}
              </div>
            </v-card-title>
            <v-card-text class="agents-list-container__dialog__body">
              {{
                $t('SUPERVISOR_AGENTS_LIST_DIALOG_BODY', {
                  name: message.state.selectedAgent.name,
                })
              }}
            </v-card-text>
            <v-card-actions>
              <div class="agents-list-container__button-container">
                <div class="agents-list-container__button-container__button">
                  <vg-button outlined @click="closeConfirmationDialog">
                    {{ $t('DISCARD') }}
                  </vg-button>
                </div>
                <div class="agents-list-container__button-container__button">
                  <vg-button @click="deactivateUser">
                    {{ $t('CONFIRM') }}
                  </vg-button>
                </div>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <agent-update-form
      :open="message.updateFormStatus === 'OPENED'"
      :submittable="message.updateFormButtonStatus === 'ENABLED'"
      :form="message.state.form"
      :validators="message.updateValidators()"
      @submitted="updateUser"
      @discard="closeUserUpdateForm"
      @backdrop="closeUserUpdateForm"
      @input="validateUpdateForm"
    />
    <agent-creation-form
      :open="message.creationFormStatus === 'OPENED'"
      :submittable="message.creationFormButtonStatus === 'ENABLED'"
      :form="message.state.form"
      :validators="message.creationValidators()"
      @submitted="createUser"
      @discard="closeUserCreationForm"
      @backdrop="closeUserCreationForm"
      @input="validateCreationForm"
    />
  </vg-content>
</template>

<script lang="ts">
import AgentCreationForm from './AgentCreationForm.ts.vue';
import AgentUpdateForm from './AgentUpdateForm.ts.vue';
import AgentsListTable from './AgentsListTable.ts.vue';
import Vue from 'vue';
import { LocalizationServiceImpl } from '@survv/commons/shell/services/LocalizationServiceImpl';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { SVG_ICON_WARNING } from '@survv/assets';
import {
  SupervisorAgentsListAction,
  SupervisorAgentsListMessage,
} from '../../../../core/blocs/supervisor/agents/SupervisorAgentsListMessage';
import { SupervisorAgentsListBloc } from '../../../../core/blocs/supervisor/agents/SupervisorAgentsListBloc';
import { UsersRepoImpl } from '../../../repositories/users/UsersRepoImpl';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'AgentsList',
  components: {
    AgentsListTable,
    AgentUpdateForm,
    AgentCreationForm,
    VgButton,
    VgSvg,
    VgContent,
  },
  data() {
    return {
      bloc: new SupervisorAgentsListBloc({
        usersRepo: new UsersRepoImpl(),
        routerService: RouterServiceImpl.getInstance(),
        localizationService: LocalizationServiceImpl.getInstance(),
        notificationService,
      }),
      message: new SupervisorAgentsListMessage(),
      SVG_ICON_WARNING,
    };
  },
  computed: {
    tableLoading(): boolean {
      return this.message.tableStatus === 'LOADING';
    },
  },
  created() {
    this.bloc.outbox().subscribe({
      next: (message: SupervisorAgentsListMessage) => {
        this.message = message;
      },
    });
    this.bloc.inbox().next(
      new SupervisorAgentsListAction({
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
        new SupervisorAgentsListAction({
          type: 'FETCH_USERS',
          payload: {
            skip,
            limit,
          },
        })
      );
    },
    sortUpdated(sort: Record<string, unknown>): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'FETCH_USERS',
          payload: {
            sort,
          },
        })
      );
    },
    openConfirmationDialog(user: unknown): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'OPEN_DIALOG',
          payload: {
            userId: user.id,
            userName: user.name,
          },
        })
      );
    },
    closeConfirmationDialog(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_DIALOG',
        })
      );
    },
    activateUser(user: unknown): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'ACTIVATE_USER',
          payload: {
            userId: user.id,
          },
        })
      );
    },
    deactivateUser(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'DEACTIVATE_USER',
        })
      );
    },
    openUserCreationForm(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'OPEN_CREATION_FORM',
        })
      );
    },
    closeUserCreationForm(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_CREATION_FORM',
        })
      );
    },
    openUserUpdateForm(user: unknown): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'OPEN_UPDATE_FORM',
          payload: {
            form: {
              id: user.id,
              name: user.name,
              email: user.email,
              mobileNo: user.mobileNo,
            },
          },
        })
      );
    },
    closeUserUpdateForm(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CLOSE_UPDATE_FORM',
        })
      );
    },
    updateUser(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'UPDATE_USER',
          payload: {
            form: { ...this.message.state.form },
          },
        })
      );
    },
    createUser(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'CREATE_USER',
          payload: {
            form: { ...this.message.state.form },
          },
        })
      );
    },
    validateUpdateForm(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'VALIDATE_UPDATE_FORM',
        })
      );
    },

    validateCreationForm(): void {
      this.bloc.inbox().next(
        new SupervisorAgentsListAction({
          type: 'VALIDATE_CREATION_FORM',
        })
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.agents-list-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: var(--inset-mid);

  &__actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    gap: var(--inset-mid);
  }

  &__dialog {
    &__header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: var(--inset-x-large) var(--inset-x-large) var(--inset-mid)
        var(--inset-x-large);

      &__svg {
        margin-inline-end: var(--inset-x-large);
      }

      &__title {
        font-weight: bold;
        font-size: 20px;
      }
    }

    &__body {
      margin-top: var(--inset-mid);
      font-size: 18px;
    }
  }

  &__button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--inset-small) 0;
    gap: var(--inset-mid);
  }
}
</style>
