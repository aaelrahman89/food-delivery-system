<template>
  <div class="panel-container" :class="[{ dark: dark }]">
    <div v-if="title && !$slots.header" class="panel-header">
      <vg-flex class="vg-flex-width" gap-size="small" align-items="center">
        <div v-if="icon">
          <vg-img
            :key="icon"
            :src="icon"
            alt="item-icon"
            width="32px"
            height="32px"
            border-radius="16px"
          ></vg-img>
        </div>
        <div class="vg-text--ellipsis" :class="[panelTitleSize, shouldBeBold]">
          {{ title }}
        </div>
      </vg-flex>
      <div
        v-if="editable && !collapsible"
        class="switcher"
        @click="editHandler"
      >
        <vg-svg :src="SVG_GLOBAL_EDIT" />
      </div>
      <div v-if="collapsible" class="switcher" @click="togglePanel()">
        <vg-svg v-if="internalCollapsed" :src="SVG_ICON_EXPAND" />
        <vg-svg v-else :src="SVG_ICON_COLLAPSE" />
      </div>
    </div>
    <div v-if="$slots.header" class="custom-panel-header">
      <slot name="header"></slot>
      <div v-if="collapsible" class="switcher" @click="togglePanel()">
        <vg-svg v-if="internalCollapsed" :src="SVG_ICON_EXPAND" />
        <vg-svg v-else :src="SVG_ICON_COLLAPSE" />
      </div>
    </div>
    <div
      v-if="!collapsible || !internalCollapsed"
      :class="[bodyClass, { 'panel-body--footer-margin': displayFooter }]"
    >
      <slot></slot>
    </div>
    <div v-if="displayFooter" class="panel-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import {
  SVG_GLOBAL_EDIT,
  SVG_ICON_COLLAPSE,
  SVG_ICON_EXPAND,
} from '@survv/assets';
import { VgFlex } from '../VgFlex/index';
import { VgImg } from '../VgImg/index';
import { VgSvg } from '../VgSvg';

const events = {
  toggle: 'toggle',
};

export default {
  name: 'VgPanel',
  components: {
    VgSvg,
    VgImg,
    VgFlex,
  },
  props: {
    title: {
      type: String,
      default: undefined,
    },
    titleSize: {
      type: String,
      default: 'small',
    },
    titleBold: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    editHandler: {
      type: Function,
      default: () => {},
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalCollapsed: true,
      panelTitleSize: 'panel-title-small',
      SVG_GLOBAL_EDIT,
      SVG_ICON_COLLAPSE,
      SVG_ICON_EXPAND,
    };
  },
  computed: {
    displayFooter() {
      return 'footer' in this.$slots;
    },
    bodyClass() {
      if (this.title && !this.$slots.header) return 'panel-body';
      if (this.$slots.header) return 'custom-panel-body';
      return 'panel-body-no-header';
    },
    shouldBeBold() {
      return this.titleBold ? 'vg-text--bold' : '';
    },
  },
  watch: {
    collapsed() {
      this.internalCollapsed = this.collapsed;
    },
  },
  created() {
    if (['small', 'large'].includes(this.titleSize)) {
      this.panelTitleSize = `panel-title-${this.titleSize}`;
    } else {
      throw new Error('invalid prop titleSize');
    }

    this.internalCollapsed = this.collapsed;
  },
  methods: {
    togglePanel() {
      this.internalCollapsed = !this.internalCollapsed;
      this.$emit(events.toggle, this.internalCollapsed);
    },
  },
};
</script>

<style scoped lang="scss">
.panel-container {
  width: 100%;
  min-height: 50px;

  position: relative;

  padding: var(--inset-mid);

  display: flex;
  flex-direction: column;

  background-color: var(--color-surface-light);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;

  .vg-flex-width {
    max-width: 80%;
  }

  .custom-panel-header {
    margin: calc(var(--inset-mid) * -1);
    padding: var(--inset-mid);
    display: flex;
    align-items: center;
  }

  .panel-header {
    height: 48px;

    padding: var(--inset-mid);

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .panel-title-small {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 16px;
      line-height: 20px;
    }
    .panel-title-large {
      color: var(--color-on-surface-mid-emphasis);
      font-size: 24px;
      line-height: 29px;
    }
  }
  .switcher {
    height: 24px;
    width: 24px;

    margin-inline-start: var(--inset-large);

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    img {
      pointer-events: none;
    }
  }

  .custom-panel-body {
    display: block;
  }

  .panel-body {
    margin-top: calc(48px - var(--inset-mid));

    display: block;
  }

  .panel-body-no-header {
    display: block;
  }

  .panel-body--footer-margin {
    margin-bottom: calc(48px - var(--inset-mid));
  }

  .panel-footer {
    height: 68px;

    padding: var(--inset-mid);

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-top: 1px solid #d7d7d7;
  }
}
.dark {
  background-color: var(--color-surface-dark);
}
</style>
