<template>
  <div id="chat" :class="{open: ChatPopUp}">
    <header>
      <Icon type="comment-alt-lines" height="16" />
      <span class="ml-1">Chat</span>

      <b-btn class="float-right" variant="link" size="sm" @click="closeChat()">
        <Icon type="times" height="20" />
      </b-btn>
    </header>

    <ul class="message-list" ref="messageList">
      <li :class="{self: message.userId === RTC.userId}" v-for="(message, index) in chatMessages" :key="`${message.timestamp}-${message.userId}-${index}`">
        <div class="avatar">
          <img :src="`${message.user.avatar}`" width="64" height="64" v-if="message.user.avatar">
        </div>

        <div class="body">
          <h6 class="userinfo">
            <span>{{ message.user.name }}</span>
          </h6>
          <p>{{ message.content }}</p>
        </div>
      </li>
    </ul>

    <form class="intercom" @submit.prevent="sendMessage">
      <input type="text" class="form-control" ref="msgContentBox" v-model.trim="msgContent" placeholder="Send a message to everyone in the room">
      <b-button-group class="actions">
        <b-btn variant="link" type="submit" :disabled="msgContent === ''">
          <Icon type="paper-plane" height="22" />
        </b-btn>
      </b-button-group>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import * as QNRTC from 'pili-rtc-web';
import { CustomMessage } from 'pili-rtc-web';
import { ChatMessage } from '../../types/message';

export default Vue.extend({
  data() {
    return {
      msgContent: "",
      chatMessages: [] as ChatMessage[]
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo",
      "RTC",
      "ChatPopUp",
      "UnreadCount"
    ])
  },

  methods: {
    ...mapMutations("room", [
      "setChatPopUp",
      "setUnreadCount"
    ]),

    closeChat() {
      this.setChatPopUp(false);
    },
    scrollMessageList() {
      if (this.$refs.messageList === undefined) return

      const messageList = this.$refs.messageList as Element;

      setTimeout(() => {
        var scrollHeight = messageList.scrollHeight
        messageList.scrollTop = scrollHeight
      }, 100)
    },

    sendMessage() {
      const message = this.RTC.encodeChatMessage(this.msgContent);
      this.RTC.sendCustomMessage(message.customMessage());
      this.appendMessage(message);
      this.msgContent = "";
    },

    appendMessage(message: ChatMessage){
      this.chatMessages.push(message);
      this.scrollMessageList()
    }
  },

  watch: {
    ChatPopUp: function (isOpen: boolean) {
      if (isOpen) {
        this.setUnreadCount(0)
      }
    }
  },

  created () {
    this.RTC.on('messages-received', (messages: CustomMessage[]) => {
      for (const message of messages) {
        const chatMessage = this.RTC.parseChatMessage(message);
        this.appendMessage(chatMessage);

        if (!this.ChatPopUp) this.setUnreadCount(this.UnreadCount + 1)
      }
    })
  },

  destroyed() {

  }
})
</script>
