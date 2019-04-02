import { Message } from '.';

const enUS: Message = {
  // Home page
  slogan: "Interact with your family, friends and colleagues",
  welcome: "In the Room Cafe, you can make video meeting calls, share your ideas and send messages to people you love.",
  sloganSignedIn: "Hi, {name}",
  welcomeSignedIn: "Get started by video meeting, idea sharing and messaging peoples below.",

  video_call: "Video call",
  video_call_features: [
    "Dramatically increase user engagement with Video calling.",
    "High quality, low-latency makes you as in a real meeting room.",
  ],

  board: "Board",
  board_features: [
    "Real-time whiteboards is the easiest way to share inspirations with your team.",
    "Provide a variety of tools like images, texts, brushes, documents, screen sharing to express your ideas.",
  ],

  message: "Message | Messaging",
  message_features: [
    "Have a group chat to immediately diss your throughts."
  ],

  quick_start: "Quick start",
  sign_in: "Sign in",

  login_quickly_placeholder: "Enter a name and start quickly",

  join: "Join",
  join_the_room: "Join the room",

  oauth_signin_title: "Or sign in with your community account",
  oauth_signin_failed_hint: "OAuth sign failed, please try again.",

  // Room
  invite_people: "Invite People",
  whiteboard: "Whiteboard",

  copy_link_to_share: "Copy link to share",
  copy_link_success: "Link copied to clipboard.",
  copy_link_error: "Copy failed. Please copy the url in the input box.",

  close_chat: "Close chat",
  open_chat: "Open chat",
  chat: "Chat",
  placeholder_send_message: "Send a message to everyone in the room",

  share_screen: "Share screen",
  stop_share_screen: "Stop Sharescreen",
  microphone_open: "Open microphone",
  microphone_mute: "Mute microphone",
  video_open: "Open video",
  video_mute: "Mute video",
  fullscreen: "Fullscreen",
  fullscreen_exit: "Exit Fullscreen",
  settings: "Settings",
  exit: "Exit",

  exited_hint: "You left the interact room.",
  reenter_room: "Reenter the room",
  go_home: "Go home",

  devices_allow_hint_title: "Allow Room Cafe to use your camera and microphone",
  devices_allow_hint_desc: "Room Cafe needs access to your camera and microphone so that other participants can see and hear you. Room Cafe will ask you to confirm this decision on each browser and computer you use",

  room_settings: {
    general: "General",
    bandwidth: "Bandwidth",
    langs: "Language",

    placeholder_select_camera: "Select camera",
    placeholder_select_microphone: "Select microphone",
    placeholder_select_speaker: "Select speaker",
    placeholder_select_resolution: "Select resolution",
    placeholder_select_langs: "Select language",

    camera: "Camera",
    microphone: "Microphone",
    speakers: "Speakers",
    incoming_video: "Incoming video",
    cancel: "Cancel",
    done: "Done",
  },

  clarity: {
    SD: "Up to 480p (SD)",
    HD: "Up to 720p (HD)",
    FHD: "Up to 1080p (FHD)",
  },

  whiteboard_tool: {
    selector: "Selector",
    pencil: "Pencil",
    text: "Text",
    rectangle: "Rectangle",
    circle: "Circle",
    stroke_settings: "Stroke settings",
    stroke_settings_color: "Color",
    stroke_settings_thickness: "Thickness",
    eraser: "Eraser",
    insert_images: "Insert Images",
  },

  uploader: {
    image_size_limit_hint: "Please upload pictures less than 2M.",
  },
}

export default enUS;