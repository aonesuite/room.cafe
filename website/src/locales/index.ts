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

  // Room
  invite_people: string;
  whiteboard: string;

  copy_link_to_share: string;
  copy_link_success: string;
  copy_link_error: string;

  close_chat: string;
  open_chat: string;
  chat: string;
  placeholder_send_message: string;

  share_screen: string;
  stop_share_screen: string;
  microphone_open: string;
  microphone_mute: string;
  video_open: string;
  video_mute: string;
  fullscreen: string;
  fullscreen_exit: string;
  settings: string;
  exit: string;

  exited_hint: string;
  reenter_room: string;
  go_home: string;

  devices_allow_hint_title: string;
  devices_allow_hint_desc: string;

  room_settings: {
    general: string;
    bandwidth: string;

    placeholder_select_camera: string;
    placeholder_select_microphone: string;
    placeholder_select_speaker: string;
    placeholder_select_resolution: string;

    camera: string;
    microphone: string;
    speakers: string;
    incoming_video: string;
    cancel: string;
    done: string;
  };

  clarity: {
    SD: string;
    HD: string;
    FHD: string;
  },

  whiteboard_tool: {
    selector: string;
    pencil: string;
    text: string;
    rectangle: string;
    circle: string;
    stroke_settings: string;
    stroke_settings_color: string;
    stroke_settings_thickness: string;
    eraser: string;
    insert_images: string;
  },

  uploader: {
    image_size_limit_hint: string;
  },
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
