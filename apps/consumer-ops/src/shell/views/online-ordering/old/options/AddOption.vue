<template>
  <v-container>
    <v-row>
      <v-col>
        <item-details-card :item="pm.item" :input-language="pm.inputLanguage">
        </item-details-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-form ref="form" @submit.prevent="submit">
              <v-container>
                <v-row>
                  <v-col tag="h3">{{
                    $t('catalogues.items.option.new')
                  }}</v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-row>
                      <v-col
                        v-if="pm.inputLanguage.en"
                        cols="12"
                        sm="6"
                        md="5"
                        lg="4"
                        xl="3"
                        order="2"
                      >
                        <v-text-field
                          v-model.trim="pm.option.title.en"
                          type="text"
                          :rules="[validate('titleEn')]"
                          :label="$t('catalogues.items.option.title.en')"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        v-if="pm.inputLanguage.ar"
                        cols="12"
                        sm="6"
                        md="5"
                        lg="4"
                        xl="3"
                      >
                        <v-text-field
                          v-model.trim="pm.option.title.ar"
                          type="text"
                          :rules="[validate('titleAr')]"
                          :label="$t('catalogues.items.option.title.ar')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-row>
                      <v-col
                        v-if="pm.inputLanguage.en"
                        cols="12"
                        sm="6"
                        md="5"
                        lg="4"
                        xl="3"
                        order="2"
                      >
                        <v-text-field
                          v-model.trim="pm.option.description.en"
                          type="text"
                          :label="$t('catalogues.items.option.description.en')"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        v-if="pm.inputLanguage.ar"
                        cols="12"
                        sm="6"
                        md="5"
                        lg="4"
                        xl="3"
                      >
                        <v-text-field
                          v-model.trim="pm.option.description.ar"
                          type="text"
                          :label="$t('catalogues.items.option.description.ar')"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-row>
                      <v-col cols="6" md="5" lg="4" xl="3">
                        <v-checkbox
                          v-model="pm.option.mandatory"
                          :label="$t('catalogues.items.option.mandatory')"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="6" md="5" lg="4" xl="3">
                        <v-checkbox
                          v-model="pm.option.multiSelection"
                          :label="$t('catalogues.items.option.multi_selection')"
                          hide-details
                          @change="pm.onMultiSelectionChange($event)"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    v-if="pm.option.multiSelection"
                    cols="12"
                    sm="6"
                    md="5"
                    lg="4"
                    xl="3"
                  >
                    <v-text-field
                      v-model.number="pm.option.minAllowed"
                      type="number"
                      min="1"
                      :label="$t('catalogues.items.option.min_allowed')"
                      :rules="[validate('minAllowed')]"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    v-if="pm.option.multiSelection"
                    cols="12"
                    sm="6"
                    md="5"
                    lg="4"
                    xl="3"
                  >
                    <v-text-field
                      v-model.number="pm.option.maxAllowed"
                      type="number"
                      min="2"
                      :label="$t('catalogues.items.option.max_allowed')"
                      :rules="[validate('maxAllowed')]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-4" align="center">
                  <v-col class="shrink" tag="h3">
                    {{ $t('catalogues.items.option.selections.$self') }}
                  </v-col>
                  <v-col class="shrink">
                    <v-icon
                      v-ripple
                      color="primary"
                      class="vg-clickable"
                      @click="newSelectionDialog = true"
                    >
                      fa-plus
                    </v-icon>
                    <selection-dialog
                      :open="newSelectionDialog"
                      :validators="pm.selectionValidators"
                      :input-language="pm.inputLanguage"
                      :options="pm.item.options"
                      @save="pm.addSelection($event)"
                      @close="newSelectionDialog = false"
                    >
                      <template #title>
                        {{ $t('catalogues.items.option.selections.new') }}
                      </template>
                    </selection-dialog>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col
                    v-for="(selection, idx) in pm.option.selections"
                    :key="idx"
                    style="border: 1px solid lightgrey"
                  >
                    <v-row align="center">
                      <v-col
                        class="vg-clickable shrink"
                        @click="pm.deleteSelection(idx)"
                      >
                        <v-icon>fa-times</v-icon>
                      </v-col>
                      <v-col
                        class="vg-clickable shrink"
                        @click="editSelection(idx)"
                      >
                        <v-icon>fa-pen</v-icon>
                      </v-col>

                      <v-col class="grow">
                        <v-row align="center">
                          <v-col class="shrink">
                            <h2>
                              <bdi>
                                <template v-if="pm.inputLanguage.en">
                                  {{ selection.title.en }}
                                </template>
                                <template
                                  v-if="
                                    pm.inputLanguage.en && pm.inputLanguage.ar
                                  "
                                >
                                  -
                                </template>
                                <template v-if="pm.inputLanguage.ar">
                                  {{ selection.title.ar }}
                                </template>
                              </bdi>
                            </h2>
                          </v-col>
                          <v-col class="shrink">
                            <v-row align="start">
                              <v-col class="shrink" tag="h4">
                                {{
                                  $t(
                                    'catalogues.items.option.selections.price'
                                  )
                                }}:
                              </v-col>
                              <v-col class="grow">
                                {{ selection.price }}
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col class="shrink">
                            <v-row align="start">
                              <v-col class="shrink" tag="h4">
                                {{
                                  $t(
                                    'catalogues.items.option.selections.calories'
                                  )
                                }}:
                              </v-col>
                              <v-col class="grow">
                                {{ selection.calories }}
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col class="shrink">
                            <v-row align="start">
                              <v-col class="shrink" tag="h4">
                                {{
                                  $t(
                                    'catalogues.items.option.selections.related_options'
                                  )
                                }}:
                              </v-col>
                              <v-col class="grow">
                                <v-row align="start" justify="start">
                                  <v-col
                                    v-for="option in selection.relatedOptions"
                                    :key="option"
                                    class="shrink pa-0"
                                  >
                                    <v-chip disabled color="secondary" outlined>
                                      <bdi>
                                        <template v-if="pm.inputLanguage.en">
                                          {{
                                            pm.item.options.find(
                                              (op) => option == op.optionId
                                            ).title.en
                                          }}
                                        </template>
                                        <template
                                          v-if="
                                            pm.inputLanguage.en &&
                                            pm.inputLanguage.ar
                                          "
                                        >
                                          -
                                        </template>
                                        <template v-if="pm.inputLanguage.ar">
                                          {{
                                            pm.item.options.find(
                                              (op) => option == op.optionId
                                            ).title.ar
                                          }}
                                        </template>
                                      </bdi>
                                    </v-chip>
                                  </v-col>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row justify="center">
                      <v-col class="shrink pa-1">
                        <v-btn
                          type="submit"
                          color="primary"
                          :disabled="!pm.canSubmit"
                          >{{ $t('misc.save_lbl') }}</v-btn
                        >
                      </v-col>
                      <v-col class="shrink pa-1">
                        <v-btn
                          color="primary"
                          :disabled="!pm.canSubmit"
                          @click="submitAndReset"
                          >{{ $t('misc.save_and_add_another') }}</v-btn
                        >
                      </v-col>
                      <v-col class="shrink pa-1">
                        <v-btn @click="clear">{{ $t('misc.clear_lbl') }}</v-btn>
                      </v-col>
                      <v-col class="shrink pa-1">
                        <v-btn @click="cancel">{{ $t('misc.cancel') }}</v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
              <selection-dialog
                :open="editSelectionDialog"
                :validators="pm.selectionValidators"
                :input-language="pm.inputLanguage"
                :options="pm.item.options"
                :selection="pm.option.selections[editedSelectionIndex]"
                :index="editedSelectionIndex"
                @save="pm.updateSelection($event)"
                @close="editSelectionDialog = false"
              >
                <template #title>
                  {{ $t('catalogues.items.option.selections.edit') }}
                </template>
              </selection-dialog>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
s
<script>
import AddItemOptionPM from '../../../../../core/presentation-models/online-ordering/AddItemOptionPM';
import ItemDetailsCard from './ItemDetailsCard.vue';
import SelectionDialog from './SelectionDialog.vue';
import notificationWatcher from '../../../../components/mixins/notificationWatcher';
import progress from '../../../../components/mixins/progress';
import validation from '../../../../components/mixins/validation';

import { ROUTE_NAMES } from '../../../../../core/routes/routeNames';

export default {
  name: 'AddOption',
  components: {
    SelectionDialog,
    ItemDetailsCard,
  },
  mixins: [progress, validation, notificationWatcher],
  data() {
    return {
      newSelectionDialog: false,
      editSelectionDialog: false,
      editedSelectionIndex: 0,
      pm: new AddItemOptionPM({
        catalogueId: Number(this.$route.params.catalogueId),
        itemId: Number(this.$route.params.itemId),
        vendorId: Number(this.$route.params.vendorId),
      }),
    };
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    editSelection(idx) {
      this.editedSelectionIndex = idx;
      this.editSelectionDialog = true;
    },
    async submit() {
      await this.pm.submit();
      await this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: this.$route.params,
      });
    },

    clear() {
      this.pm.clear();
      this.$refs.form.resetValidation();
    },
    async submitAndReset() {
      await this.pm.submitAndReset();
      this.$refs.form.resetValidation();
    },
    cancel() {
      this.$router.push({
        name: ROUTE_NAMES.ONLINE_ORDERING_CATALOGUE_ITEM_DETAILS,
        params: this.$route.params,
      });
    },
  },
};
</script>
