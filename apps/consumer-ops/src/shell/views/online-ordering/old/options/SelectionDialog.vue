<template>
  <v-dialog :value="open" lazy full-width max-width="540px" persistent>
    <v-card>
      <v-card-title>
        <h1>
          <slot name="title"></slot>
        </h1>
      </v-card-title>

      <v-card-text>
        <v-form ref="selectionForm" lazy-validation="">
          <v-container class="pa-0">
            <v-row>
              <v-col>
                <v-row>
                  <v-col v-if="inputLanguage.en" cols="12" sm="6" order="2">
                    <v-text-field
                      v-model.trim="localSelection.title.en"
                      type="text"
                      :rules="[validate({ field: 'title', locale: 'en' })]"
                      :label="$t('catalogues.items.option.selections.title.en')"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col v-if="inputLanguage.ar" cols="12" sm="6">
                    <v-text-field
                      v-model.trim="localSelection.title.ar"
                      type="text"
                      :rules="[validate({ field: 'title', locale: 'ar' })]"
                      :label="$t('catalogues.items.option.selections.title.ar')"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model.number="localSelection.price"
                  type="number"
                  min="1"
                  :label="$t('catalogues.items.option.selections.price')"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model.number="localSelection.calories"
                  type="number"
                  min="1"
                  :label="$t('catalogues.items.option.selections.calories')"
                  :rules="[validate({ field: 'calories' })]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="localSelection.relatedOptions"
                  :label="
                    $t('catalogues.items.option.selections.related_options')
                  "
                  :items="localOptions"
                  item-value="optionId"
                  item-text="text"
                  multiple
                  chips
                  deletable-chips
                  hide-selected
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">
          {{ $t('misc.cancel') }}
        </v-btn>
        <v-btn color="primary" text :disabled="!valid" @click="save">
          {{ $t('misc.save_lbl') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ObjectUtils from '../../../../../core/etc/ObjectUtils';

export default {
  name: 'SelectionDialog',
  props: {
    inputLanguage: {
      type: Object,
      default: undefined,
      required: true,
    },
    open: {
      type: Boolean,
      default: false,
      required: true,
    },
    validators: {
      type: Object,
      default: undefined,
      required: true,
    },
    options: {
      type: Array,
      default: undefined,
      required: true,
    },
    index: {
      type: [String, Number],
      default: undefined,
    },
    selection: {
      type: Object,
      default() {
        return {
          title: {
            en: undefined,
            ar: undefined,
          },
          calories: undefined,
          price: undefined,
          relatedOptions: [],
        };
      },
    },
  },
  data() {
    return {
      localSelection: {
        title: {
          en: undefined,
          ar: undefined,
        },
        calories: undefined,
        price: undefined,
        relatedOptions: [],
      },
      localOptions: [],
    };
  },
  computed: {
    valid() {
      const { title, calories } = this.validators;
      return (
        title({
          selection: this.localSelection,
          locale: 'en',
        }) === true &&
        title({
          selection: this.localSelection,
          locale: 'ar',
        }) === true &&
        calories({ selection: this.localSelection }) === true
      );
    },
  },
  watch: {
    open(value) {
      if (value) this.reset();
    },
  },

  methods: {
    validate({ field, locale }) {
      const validation = this.validators[field]({
        selection: this.localSelection,
        locale,
      });
      return validation === true ? true : this.$t(validation);
    },
    reset() {
      this.localSelection = ObjectUtils.deepClone(this.selection);
      this.localOptions = this.options.map((option) => {
        let text = '';
        if (this.inputLanguage.en) {
          text += option.title.en;
        }
        if (this.inputLanguage.en && this.inputLanguage.ar) {
          text += ' - ';
        }
        if (this.inputLanguage.ar) {
          text += option.title.ar;
        }

        return {
          optionId: option.optionId,
          text,
        };
      });
      if (this.$refs.selectionForm) this.$refs.selectionForm.resetValidation();
    },
    cancel() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', { ...this.localSelection, index: this.index });
      this.$emit('close');
    },
  },
};
</script>

<style scoped></style>
