<template>
  <div class="welcome">
    <div class="photograph"></div>
    <div class="hero">
      <div class="section">
        <h1>Interact with your family, friends and colleagues</h1>
        <h3>In the Room Cafe, you can make video meeting calls, share your ideas and send messages to people you love.</h3>

        <div class="feature-actions">
          <ul class="list-inline">
            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle">
                <Icon type="video" width="24" height="24" />
              </button>
              <span>Video Call</span>
            </li>

            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle">
                <Icon type="chalkboard" width="24" height="24" />
              </button>
              <span>Board</span>
            </li>

            <li class="list-inline-item">
              <button class="btn btn-outline-primary rounded-circle">
                <Icon type="comment-alt-lines" width="24" height="24" />
              </button>
              <span>Message</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter, Mutation } from 'vuex-class';
import { AxiosPromise } from 'axios';

import { UserState } from '@/store/modules/user';

const namespace: string = 'user';

@Component
export default class Home extends Vue {
  @Prop() private msg!: string;

  // MapAction
  // @Action('fetchState', { namespace }) fetchState: AxiosPromise<UserState>;
}
</script>
