<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
          <v-col cols="12" sm="6" lg="5">
            <v-card style="min-width: 300px">
              <v-card-title>
                <slot name="title" />
              </v-card-title>
              <v-card-text>
                <slot />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'VgSimpleLayout',
};
</script>
