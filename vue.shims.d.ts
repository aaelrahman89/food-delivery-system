declare module '*.vue' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import Vue from 'vue';

  export default Vue;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
