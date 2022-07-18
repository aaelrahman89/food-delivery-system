<template>
  <v-file-input
    ref="fileLoader"
    v-model="file"
    :accept="accept"
    show-size
    @change="loadFile"
    @click:clear="emitClear"
  ></v-file-input>
</template>

<script>
import { base64EncodedFile } from '../../core/forms/formModels';
import { errorCodes, errorModel } from '../../core/errors/errors';
import { isObject } from '../../core/utils/checks';

export default {
  name: 'Base64FileLoader',
  props: {
    accept: {
      type: String,
      default: undefined,
    },
    sizeLimitBytes: {
      type: Number,
      default: 3 * 1024 * 1024,
    },
  },
  data() {
    return {
      events: {
        loaded: 'loaded',
        error: 'error',
        clear: 'clear',
      },
      file: undefined,
    };
  },
  methods: {
    emitClear() {
      this.$emit(this.events.clear);
    },
    validateLimit(file) {
      if (file.size > this.sizeLimitBytes) {
        throw errorModel({
          message: 'File limit exceeded',
          code: errorCodes.FILE_LIMIT_EXCEEDED,
          args: { limitInMegaBytes: this.sizeLimitBytes / 1024 / 1024 },
        });
      }
      return true;
    },
    validateType(file) {
      if (this.accept && !this.accept.includes(file.type)) {
        throw errorModel({
          message: 'Wrong file type',
          code: errorCodes.BAD_FILE_TYPE,
          args: {
            fileType: file.type,
            acceptedTypes: this.accept,
          },
        });
      }

      return true;
    },

    trigger() {
      this.$refs.fileLoader.$el.click();
    },

    loadFile(file) {
      try {
        if (isObject(file)) {
          this.validateLimit(file);
          this.validateType(file);

          const fileReader = new window.FileReader();

          fileReader.readAsDataURL(file);

          fileReader.onload = () => {
            this.$emit(
              this.events.loaded,
              base64EncodedFile({ dataUrl: fileReader.result })
            );
          };

          fileReader.onerror = (err) =>
            this.$emit(
              this.events.error,
              errorModel({
                message: err.message,
                code: errorCodes.TECHNICAL_ERROR,
              })
            );

          fileReader.onabort = (err) =>
            this.$emit(
              this.events.error,
              errorModel({
                message: err.message,
                code: errorCodes.TECHNICAL_ERROR,
              })
            );
        }
      } catch (errModel) {
        this.$emit(this.events.error, errModel);
      }
    },
  },
};
</script>

<style scoped></style>
