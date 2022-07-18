<template>
  <div>
    <input
      ref="fileInput"
      class="vg-file-loader"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @input="load"
    />
    <slot
      name="activator"
      v-bind="{
        activate,
      }"
    ></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Base64EncodedFile } from '../../core/models/Files';
import { FileLoaderImpl } from '../../shell/file-loader/FileLoaderImpl';

const events = {
  load: 'load',
  error: 'error',
};

function getExtensions(accept: string): string[] {
  return accept
    ?.split(',')
    .filter((string) => string.startsWith('.'))
    .map((extension) => extension.substr(1));
}
function getTypes(accept: string): string[] {
  return accept?.split(',').filter((string) => string.includes('/'));
}

export default Vue.extend({
  name: 'VgFileLoader',
  props: {
    accept: {
      type: String,
      default: undefined,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileLoader: new FileLoaderImpl({
        limit: this.limit,
        extensions: getExtensions(this.accept),
        types: getTypes(this.accept),
      }),
    };
  },
  methods: {
    activate(): void {
      (this.$refs.fileInput as HTMLInputElement).value = '';
      (this.$refs.fileInput as HTMLInputElement).click();
    },
    async loadSingleFile(files: FileList): Promise<void> {
      this.$emit(events.load, await this.fileLoader.loadAsBase64(files[0]));
    },
    async loadMultipleFiles(files: FileList): Promise<void> {
      let loadedFiles: Base64EncodedFile[] = [];

      for (let i = 0; i < files.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const base64File = await this.fileLoader.loadAsBase64(files[i]);
        loadedFiles = [...loadedFiles, base64File];
      }

      this.$emit(events.load, loadedFiles);
    },
    async load(event: Event): Promise<void> {
      try {
        const files = (event.target as HTMLInputElement).files as FileList;

        if (files.length === 0) return;
        if (this.multiple) await this.loadMultipleFiles(files);
        else await this.loadSingleFile(files);
      } catch (err) {
        this.$emit(events.error, err);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.vg-file-loader {
  display: none;
}
</style>
