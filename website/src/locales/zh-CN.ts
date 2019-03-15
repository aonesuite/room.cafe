import { Message } from '.';

const zhCN: Message = {
  // Home page
  slogan: "与你的家人、朋友和同事互动",
  welcome: "在 Room Cafe，你可以召开视频会议，使用白板分享你的想法，与你喜欢的人发信息聊天。",
  sloganSignedIn: "嗨，{name}",
  welcomeSignedIn: "开始视频会议，分享创意和群聊吧。",

  video_call: "实时视频",
  video_call_features: [
    "高清、低延迟的实时语音和视频交流",
    "高效会议交流，良好体验宛如身临其境",
  ],

  board: "互动白板",
  board_features: [
    "团队分享想法和创意的绝佳工具",
    "图片、文字、画笔... 丰富你的展示效果",
  ],

  message: "收发消息",
  message_features: [
    "群聊信息，及时沟通",
  ],

  quick_start: "快速开始",
  sign_in: "登录",

  login_quickly_placeholder: "输入您的名字然后快速开始",

  join: "加入",
  join_the_room: "加入房间",

  oauth_signin_title: "使用第三方账户登录",
  oauth_signin_failed_hint: "登录失败，请您重新尝试。",

  // Room
  invite_people: "邀请",
  whiteboard: "白板",
  copy_link_to_share: "拷贝分享链接",
  close_chat: "关闭聊天",
  open_chat: "打开聊天",
  share_screen: "分享屏幕",
  stop_share_screen: "停止屏幕分享",
  microphone_open: "打开麦克风",
  microphone_mute: "麦克风静音",
  video_open: "开启摄像头",
  video_mute: "关闭摄像头",
  fullscreen: "全屏",
  fullscreen_exit: "退出全屏",
  settings: "设置",
  exit: "离开房间",

  // Room setting modal
  room_settings: {
    general: "常规",
    bandwidth: "带宽",

    placeholder_select_camera: "选择摄像头",
    placeholder_select_microphone: "选择麦克风",
    placeholder_select_speaker: "选择扬声器",
    placeholder_select_resolution: "选择分辨率",

    camera: "摄像头",
    microphone: "麦克风",
    speakers: "扬声器",
    incoming_video: "输入分辨率",
    cancel: "取消",
    done: "完成",
  },

  clarity: {
    SD: "最高 480p (标清)",
    HD: "最高 720p (高清)",
    FHD: "最高 1080p (超清)",
  },

  whiteboard_tool: {
    selector: "选择",
    pencil: "铅笔",
    text: "文字",
    rectangle: "矩形",
    circle: "椭圆",
    stroke_settings: "画笔、颜色",
    stroke_settings_color: "颜色",
    stroke_settings_thickness: "画笔粗细",
    eraser: "橡皮擦",
    insert_images: "插入图片",
  },

  uploader: {
    image_size_limit_hint: "请上传不超过 2M 的图片",
  },
}

export default zhCN;
