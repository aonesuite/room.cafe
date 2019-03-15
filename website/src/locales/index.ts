import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)

import enUS from './en-US';
import zhCN from './zh-CN';

export declare type Message = {
  slogan: string;
  welcome: string;

  sloganSignedIn: string;
  welcomeSignedIn: string;

  video_call: string;
  video_call_features: string[];

  board: string;
  board_features: string[];

  message: string;
  message_features: string[];

  quick_start: string;
  sign_in: string;

  login_quickly_placeholder: string,

  join: string;
  join_the_room: string;

  oauth_signin_title: string;
  oauth_signin_failed_hint: string;
}

// Ready translated locale messages
export const langs = {
  "en-US": "English",
  'zh-CN': "简体中文",
}

// Ready translated locale messages
export const messages = {
  "en-US": enUS,
  'zh-CN': zhCN,
}

// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: 'en-US', // set locale
  fallbackLocale: 'en-US',
  messages, // set locale messages
})
