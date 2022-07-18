<template>
  <vg-content :breadcrumbs="breadcrumbs">
    <div class="form-container">
      <vg-panel class="form-container__panel" :title="$t('NOTIFICATION')">
        <div class="form-container__panel__inputs">
          <vg-text-field
            :value="message.state.form.header"
            :label="$t('PUSH_NOTIFICATIONS_HEADER')"
            type="text"
            max-width="100%"
            outlined
            @input="updateHeader($event)"
          ></vg-text-field>
        </div>
        <div class="form-container__panel__inputs input-background">
          <vg-textarea
            :value="message.state.form.message"
            :label="$t('PUSH_NOTIFICATIONS_MESSAGE')"
            type="text"
            outlined
            @input="updateMessage($event)"
          ></vg-textarea>
        </div>
      </vg-panel>
      <vg-panel class="form-container__panel" :title="$t('AUDIENCE')">
        <div>
          <input
            ref="CSVUpload"
            type="file"
            accept=".csv"
            style="display: none"
            @input="uploadCSV"
          />
          <div class="csv-uploader">
            <div>
              {{ csvFileName }}
            </div>
            <div>
              <vg-button flat icon @click="triggerUpload">
                <vg-svg :src="SVG_FILE" width="24px" height="24px"></vg-svg>
              </vg-button>
            </div>
          </div>
          <bdi class="csv-uploader-hint">
            {{ $t('CSV_MUST_CONTAIN_PHONE_NUMBERS') }}
          </bdi>
        </div>
      </vg-panel>
      <div class="form-container__buttons form-container__panel">
        <vg-button outlined>{{ $t('DISCARD') }}</vg-button>
        <vg-button
          :disabled="isCreateBtnDisabled"
          :loading="isCreateBtnLoading"
          @click="createNotification"
        >
          {{ $t('CREATE') }}
        </vg-button>
      </div>
    </div>
  </vg-content>
</template>

<script lang="ts">
import Vue from 'vue';
import parser from 'papaparse';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import {
  PushNotificationCreationAction,
  PushNotificationCreationMessage,
} from '../../../../core/blocs/push-notifications/PushNotificationCreationMessage';
import { PushNotificationCreationBloc } from '../../../../core/blocs/push-notifications/PushNotificationCreationBloc';
import { PushNotificationsRepoImpl } from '../../../repositories/push-notifications/PushNotificationsRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { RouterServiceImpl } from '@survv/commons/shell/services/RouterServiceImpl';
import { SVG_FILE } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { VgTextarea } from '@survv/commons/components/VgTextarea';
import { createNotification } from '../../../../core/notification';
import { errorModel } from '@survv/commons/core/errors/errors';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'PushNotificationCreation',
  components: { VgContent, VgPanel, VgButton, VgTextField, VgTextarea, VgSvg },
  data() {
    return {
      SVG_FILE,
      csvFileName: this.$t('AUDIENCE_FILE'),
      bloc: new PushNotificationCreationBloc({
        pushNotificationsRepo: new PushNotificationsRepoImpl(),
        notificationService,
        routerService: RouterServiceImpl.getInstance(),
      }),
      message: new PushNotificationCreationMessage(),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.PUSH_NOTIFICATIONS,
          text: 'NOTIFICATIONS',
        },
        {
          routeName: ROUTE_NAMES.PUSH_NOTIFICATIONS_CREATION,
          text: 'NEW_NOTIFICATION',
        },
      ];
    },
    isCreateBtnDisabled(): boolean {
      return this.message.formStatus === 'INVALID';
    },
    isCreateBtnLoading(): boolean {
      return this.message.status === 'LOADING';
    },
  },
  created() {
    this.bloc.outbox().subscribe((message: PushNotificationCreationMessage) => {
      this.message = message;
    });
  },
  methods: {
    triggerUpload(): void {
      (this.$refs.CSVUpload as HTMLInputElement).click();
    },
    uploadCSV(event: Event): void {
      const element = event.target as HTMLInputElement;
      const { files } = element;
      if (files && files[0]) {
        parser.parse(files[0], {
          header: true,
          complete: (CSVData: { data: Record<string, string>[] }) => {
            this.csvFileName = files[0].name;
            const audience = this.extractAudiencePhoneNumbers(CSVData.data);
            this.bloc.inbox().next(
              new PushNotificationCreationAction({
                type: 'UPDATE_FORM',
                payload: {
                  form: {
                    ...this.message.state.form,
                    audience,
                  },
                },
              })
            );
          },
        });
      }
    },
    extractAudiencePhoneNumbers(data: Record<string, string>[]) {
      const phoneNumbers = data
        .map((CSVRow: Record<string, string>) => CSVRow['$properties.$phone'])
        .filter((phoneNumber: string | undefined) => phoneNumber);

      if (!phoneNumbers.length) {
        notificationService.notify(
          createNotification(
            errorModel({
              message: 'Invalid CSV File',
              args: {
                headerName: '$properties.$phone',
              },
              code: 'InvalidCSVFIleException',
            })
          )
        );
        return [];
      }

      return phoneNumbers;
    },
    updateHeader(header: string) {
      this.bloc.inbox().next(
        new PushNotificationCreationAction({
          type: 'UPDATE_FORM',
          payload: {
            form: {
              ...this.message.state.form,
              header,
            },
          },
        })
      );
    },
    updateMessage(message: string) {
      this.bloc.inbox().next(
        new PushNotificationCreationAction({
          type: 'UPDATE_FORM',
          payload: {
            form: {
              ...this.message.state.form,
              message,
            },
          },
        })
      );
    },
    createNotification() {
      this.bloc.inbox().next(
        new PushNotificationCreationAction({
          type: 'CREATE_PUSH_NOTIFICATION',
          payload: {},
        })
      );
    },
  },
});
</script>

<style scoped lang="scss">
.input-background ::v-deep .v-input__slot {
  background-color: white !important;
}

.form-container {
  display: flex;
  gap: var(--inset-mid);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  padding: var(--inset-large);
  flex-wrap: wrap;
  &__panel {
    flex-basis: 100%;
    &__inputs {
      max-width: 50%;
    }
  }

  &__buttons {
    display: flex;
    gap: var(--inset-mid);
    justify-content: flex-end;
  }
}

.csv-uploader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  padding: var(--inset-mid);
  margin: var(--inset-small) 0;
  color: var(--color-on-surface-low-emphasis);
}
.csv-uploader-hint {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-inline-start: var(--inset-mid);
  color: var(--color-on-surface-low-emphasis);
  font-size: 12px;
}
</style>
