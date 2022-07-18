<template>
  <!--  eslint-disable vue/no-v-html-->
  <div v-if="false" class="vg-svg" :style="computedStyle" v-html="svg"></div>
</template>
<script lang="ts">
import Vue from 'vue';

interface SvgSource {
  filename: string;
}

export default Vue.extend({
  name: 'VgSvg',
  props: {
    src: {
      type: Object,
      required: true,
    },
    fill: {
      type: String,
      default: undefined,
    },
    // some svg files will never show unless given an explicit width and height
    minWidth: {
      type: String,
      default: undefined,
    },
    minHeight: {
      type: String,
      default: undefined,
    },
    width: {
      type: String,
      default: undefined,
    },
    height: {
      type: String,
      default: undefined,
    },
    maxWidth: {
      type: String,
      default: undefined,
    },
    maxHeight: {
      type: String,
      default: undefined,
    },
    svgProps: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      svg: '',
    };
  },
  computed: {
    computedStyle(): Record<string, string> {
      return {
        'min-width': this.minWidth,
        'min-height': this.minHeight,
        'width': this.width,
        'height': this.height,
        'max-width': this.maxWidth,
        'max-height': this.maxHeight,
      };
    },
  },
  watch: {
    async src(): Promise<void> {
      return this.setSvgTemplate();
    },
    fill(): void {
      this.setSvgStyleProp('fill', this.fill);
    },
  },
  async created(): Promise<void> {
    return this.setSvgTemplate();
  },
  methods: {
    async setSvgTemplate(): Promise<void> {
      const { filename } = this.src as SvgSource;
      const svgModule = await import(
        `@survv/assets/public/images/svg/${filename}`
      );
      this.svg = svgModule.default;

      // wait for vue to render the svg element so that it's not null
      this.$nextTick(() => {
        this.setSvgStyleProp('fill', this.fill);
        this.setSvgAttributeIfNotExists('height', '100%');
        if (this.svgProps) {
          Object.keys(this.svgProps).forEach((key) =>
            this.setSvgAttribute(key, this.svgProps[key])
          );
        }
      });
    },
    setSvgStyleProp(propName: string, value: string): void {
      (this.$el.firstChild as SVGElement).style.setProperty(propName, value);
    },
    setSvgAttribute(attrName: string, value: string): void {
      (this.$el.firstChild as SVGElement).setAttribute(attrName, value);
    },
    setSvgAttributeIfNotExists(attrName: string, value: string): void {
      const el = this.$el.firstChild as SVGElement;
      const attr = el.getAttribute(attrName);
      if (!attr) {
        this.setSvgAttribute(attrName, value);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.vg-svg {
  display: flex;
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
