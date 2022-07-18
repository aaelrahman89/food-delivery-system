<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <v-card>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-row justify="start">
            <v-col cols="12">
              <v-row>
                <v-col cols="12" sm="5" md="4" align-self="center">
                  <vg-flex justify-content="center" align-items="center">
                    <vg-image-loader
                      width="200"
                      height="200"
                      radius="100"
                      :image.sync="pm.form.profileImage"
                      @error="pm.onIconLoadingFailure($event)"
                    ></vg-image-loader>
                  </vg-flex>
                </v-col>
                <v-col cols="12" sm="7" md="8">
                  <vg-text-field
                    v-model="pm.form.name"
                    :validator="pm.form.validators.name"
                    label="USERS_CREATION_USER_NAME"
                    type="text"
                    required
                    outlined
                    max-width="100%"
                  />
                  <vg-text-field
                    v-model="pm.form.email"
                    :validator="pm.form.validators.email"
                    label="USERS_CREATION_EMAIL"
                    type="text"
                    required
                    outlined
                    max-width="100%"
                  />
                  <vg-text-field
                    v-model="pm.form.mobileNo"
                    :validator="pm.form.validators.mobileNo"
                    label="USERS_CREATION_MOBILE_NO"
                    type="tel"
                    required
                    outlined
                    max-width="100%"
                  />
                  <vg-select
                    :selection.sync="pm.form.userRoles"
                    :options="pm.userRoles"
                    :validator="pm.form.validators.userRoles"
                    label="USERS_CREATION_ROLE"
                    required
                    multiple
                    outlined
                    max-width="100%"
                  >
                  </vg-select>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="text-center" cols="12">
              <v-btn
                :loading="pm.loading"
                :disabled="!pm.form.submittable || pm.loading"
                :dark="pm.form.submittable && !pm.loading"
                type="submit"
                color="vg-darkgrey"
              >
                {{ $t('CREATE') }}
              </v-btn>
              <v-btn @click="pm.form.reset()">
                {{ $t('CLEAR') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </vg-content>
</template>

<script>
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { UserCreationPM } from '../../../../core/presentation-models/users/UserCreationPM';
import { UsersRepoImpl } from '../../../repositories/users/UsersRepoImpl';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImageLoader } from '@survv/commons/components/VgImageLoader';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'CreateUser',
  components: { VgImageLoader, VgTextField, VgSelect, VgFlex, VgContent },
  data() {
    return {
      pm: new UserCreationPM({
        userId: this.$route.params.userId,
        notificationService,
        usersRepo: new UsersRepoImpl(),
      }),
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          routeName: ROUTE_NAMES.USERS_LIST,
          text: this.$t('USERS_LIST'),
        },
        {
          routeName: ROUTE_NAMES.USERS_CREATION,
          text: this.$t('USERS_CREATION'),
        },
      ];
    },
  },
  methods: {
    async submit() {
      const submitted = await this.pm.form.submit();
      if (submitted) {
        await this.$router.push({ name: ROUTE_NAMES.USERS_LIST });
      }
    },
  },
};
</script>

<style scoped></style>
