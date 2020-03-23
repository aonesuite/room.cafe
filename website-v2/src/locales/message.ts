export interface IMessage {
  slogan: string
  welcome: string

  sloganSignedIn: string
  welcomeSignedIn: string

  video_call: string
  video_call_features: string[]

  board: string
  board_features: string[]

  message: string
  message_features: string[]

  quick_start: string
  sign_in: string

  contact: string

  login_quickly_placeholder: string,

  join: string
  join_the_room: string

  oauth_signin_title: string
  oauth_signin_failed_hint: string

  // Room
  invite_people: string
  whiteboard: string

  copy_link_to_share: string
  copy_link_success: string
  copy_link_error: string

  close_chat: string
  open_chat: string
  chat: string
  placeholder_send_message: string

  share_screen: string
  stop_share_screen: string
  microphone_open: string
  microphone_mute: string
  video_open: string
  video_mute: string
  fullscreen: string
  fullscreen_exit: string
  settings: string
  exit: string

  exited_hint: string
  reenter_room: string
  go_home: string

  devices_allow_hint_title: string
  devices_allow_hint_desc: string

  room_settings: {
    general: string
    bandwidth: string

    placeholder_select_camera: string
    placeholder_select_microphone: string
    placeholder_select_speaker: string
    placeholder_select_resolution: string
    placeholder_select_langs: string

    camera: string
    microphone: string
    speakers: string
    incoming_video: string
    langs: string
    cancel: string
    done: string
  }

  clarity: {
    SD: string
    HD: string
    FHD: string
  },

  whiteboard_tool: {
    selector: string
    pencil: string
    text: string
    rectangle: string
    circle: string
    stroke_settings: string
    stroke_settings_color: string
    stroke_settings_thickness: string
    eraser: string
    insert_images: string
  },

  uploader: {
    image_size_limit_hint: string
  },
}
