<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form v-if="pm" @submit.prevent="submit">
      <div class="tag-group-form">
        <div class="tag-group-form__header">
          <h1>{{ $t(title) }}</h1>
        </div>
        <div class="tag-group-form__body">
          <div class="tag-group-form__body__form">
            <div class="tag-group-form__input">
              <vg-image-loader
                width="56"
                height="56"
                radius="4"
                :image.sync="pm.form.icon"
                @error="pm.onIconLoadingFailure($event)"
              ></vg-image-loader>
            </div>
            <div class="tag-group-form__input">
              <v-text-field
                v-model.trim="pm.form.name.en"
                type="text"
                outlined
                clearable
                :rules="[validate('name.en')]"
                :label="$t('TAG_GROUP_FORM_ENGLISH_NAME') + '*'"
              ></v-text-field>
            </div>
            <div class="tag-group-form__input">
              <v-text-field
                v-model.trim="pm.form.name.ar"
                type="text"
                outlined
                clearable
                :rules="[validate('name.ar')]"
                :label="$t('TAG_GROUP_FORM_ARABIC_NAME') + '*'"
              ></v-text-field>
            </div>
            <div class="tag-group-form__input">
              <vg-select
                :selection.sync="pm.form.status"
                :options="pm.tagGroupStatusOptions"
                label="TAG_GROUP_FORM_STATUS"
                :validator="pm.validators().status"
                required
                outlined
              >
              </vg-select>
            </div>
          </div>
          <vg-panel title="Tags">
            <vg-flex gap-size="small" align-items="center">
              <vg-chip
                v-for="tag in pm.form.tags"
                :key="tag.id"
                :img="tag.icon"
                @cancel="unselectTag(tag)"
              >
                {{ $t(tag.name) }}
              </vg-chip>
              <div>
                <vg-button
                  class="add-button"
                  outlined
                  icon
                  :loading="pm.loading"
                  :disabled="pm.loading"
                  @click="openSelections"
                >
                  <svg viewBox="0 0 448 448" class="add-button__icon">
                    <path
                      d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0"
                    />
                  </svg>
                </vg-button>
              </div>
            </vg-flex>
          </vg-panel>
        </div>
        <div class="tag-group-form__footer">
          <vg-button outlined @click="discard">{{
            $t('TAG_GROUP_FORM_CANCEL')
          }}</vg-button>
          <vg-button
            type="submit"
            :loading="pm.loading"
            :disabled="!pm.canSubmit"
            >{{ $t('TAG_GROUP_FORM_SUBMIT') }}
          </vg-button>
        </div>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import validation from '../../../components/mixins/validation';
import { TagGroupCreationPM } from '../../../../core/presentation-models/online-ordering/TagGroupCreationPM';
import { TagGroupUpdatePM } from '../../../../core/presentation-models/online-ordering/TagGroupUpdatePM';
import { UnifiedTag } from '../../../../core/models/UnifiedTag';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgChip } from '@survv/commons/components/VgChip';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImageLoader } from '@survv/commons/components/VgImageLoader';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSelect } from '@survv/commons/components/VgSelect';

const events = {
  submit: 'submit',
  discard: 'discard',
  backdrop: 'backdrop',
  openSelections: 'open:selections',
};

export default Vue.extend({
  name: 'TagGroupForm',
  components: {
    VgPanel,
    VgImageLoader,
    VgOverlay,
    VgButton,
    VgChip,
    VgSelect,
    VgFlex,
  },
  mixins: [validation],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    pm: {
      type: [TagGroupUpdatePM, TagGroupCreationPM],
      default: undefined,
    },
  },
  computed: {
    title(): string {
      return this.pm instanceof TagGroupCreationPM
        ? 'TAG_GROUP_FORM_HEADER_CREATION'
        : 'TAG_GROUP_FORM_HEADER_UPDATE';
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    unselectTag(tag: UnifiedTag): void {
      this.pm!.form.tags = this.pm!.form.tags.filter((el) => tag.id != el.id);
    },
    async submit(): Promise<void> {
      if (await this.pm!.submit()) {
        this.$emit(events.submit);
      }
    },
    openSelections(): void {
      this.$emit(events.openSelections);
    },
  },
});
</script>

<style scoped lang="scss">
.tag-group-form {
  background-color: var(--color-surface-light);
  border-radius: var(--inset-tiny);
  padding: var(--inset-mid);

  &__footer {
    margin-top: var(--inset-mid);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  &__body {
    margin-top: var(--inset-mid);

    &__form {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      flex-wrap: wrap;

      border: 1px solid var(--color-border-light);
      border-radius: var(--inset-tiny);
      padding: var(--inset-mid);
      padding-bottom: 0;
      margin-bottom: var(--inset-mid);
    }
  }

  &__footer {
    justify-content: flex-end;

    button:not(:last-child) {
      margin-inline-end: var(--inset-mid);
    }
  }

  &__input {
    max-width: 240px;
    &:not(:last-child) {
      margin-inline-end: var(--inset-mid);
    }
  }
}

.add-button__icon {
  width: 14px;
  height: 14px;
  fill: var(--color-primary);
}
</style>
