import React from "react"

import "./index.scss"

import{ ReactComponent as Logo            } from "./Logo.svg"            // room cafe
import{ ReactComponent as Video           } from "./Video.svg"           // 摄像头
import{ ReactComponent as VideoSlash      } from "./VideoSlash.svg"      // 摄像头(禁用)
import{ ReactComponent as Microphone      } from "./Microphone.svg"      // 麦克风
import{ ReactComponent as MicrophoneSlash } from "./MicrophoneSlash.svg" // 麦克风(禁用)
import{ ReactComponent as Phone           } from "./Phone.svg"           // 电话
import{ ReactComponent as Chalkboard      } from "./Chalkboard.svg"      // 黑板
import{ ReactComponent as CommentAltLines } from "./CommentAltLines.svg" // 评论，消息
import{ ReactComponent as Cog             } from "./Cog.svg"             // 齿轮，设置
import{ ReactComponent as ScreenFull      } from "./ScreenFull.svg"      // 进入全屏
import{ ReactComponent as ScreenNormal    } from "./ScreenNormal.svg"    // 退出全屏
import{ ReactComponent as ScreenEnter     } from "./ScreenEnter.svg"     // 进入全屏
import{ ReactComponent as ScreenExit      } from "./ScreenExit.svg"      // 退出全屏
import{ ReactComponent as ScreenShare     } from "./ScreenShare.svg"     // 屏幕分享
import{ ReactComponent as SignOutAlt      } from "./SignOutAlt.svg"      // 退出
import{ ReactComponent as UserPlus        } from "./UserPlus.svg"        // 添加用户
import{ ReactComponent as Link            } from "./Link.svg"            // 链接
import{ ReactComponent as PaperPlane      } from "./PaperPlane.svg"      // 发送
import{ ReactComponent as Times           } from "./Times.svg"           // 叉，关闭
import{ ReactComponent as Layer           } from "./Layer.svg"           // 图层
import{ ReactComponent as Images          } from "./Images.svg"          // 图层
import{ ReactComponent as Globe           } from "./Globe.svg"           // 地球
import{ ReactComponent as MousePointer    } from "./MousePointer.svg"    // 默认鼠标， 选择工具
import{ ReactComponent as PencilAlt       } from "./PencilAlt.svg"       // 铅笔
import{ ReactComponent as Text            } from "./Text.svg"            // 文字
import{ ReactComponent as Rectangle       } from "./Rectangle.svg"       // 矩形
import{ ReactComponent as Square          } from "./Square.svg"          // 正方形
import{ ReactComponent as Circle          } from "./Circle.svg"          // 圆形
import{ ReactComponent as Eraser          } from "./Eraser.svg"          // 橡皮擦
import{ ReactComponent as Google          } from "./Google.svg"          // Google
import{ ReactComponent as GitHub          } from "./GitHub.svg"          // GitHub

export const LogoSVG            = Logo
export const VideoSVG           = Video
export const VideoSlashSVG      = VideoSlash
export const MicrophoneSVG      = Microphone
export const MicrophoneSlashSVG = MicrophoneSlash
export const PhoneSVG           = Phone
export const ChalkboardSVG      = Chalkboard
export const CommentAltLinesSVG = CommentAltLines
export const CogSVG             = Cog
export const ScreenFullSVG      = ScreenFull
export const ScreenNormalSVG    = ScreenNormal
export const ScreenEnterSVG     = ScreenEnter
export const ScreenExitSVG      = ScreenExit
export const ScreenShareSVG     = ScreenShare
export const SignOutAltSVG      = SignOutAlt
export const UserPlusSVG        = UserPlus
export const LinkSVG            = Link
export const PaperPlaneSVG      = PaperPlane
export const TimesSVG           = Times
export const LayerSVG           = Layer
export const ImagesSVG          = Images
export const GlobeSVG           = Globe
export const MousePointerSVG    = MousePointer
export const PencilAltSVG       = PencilAlt
export const TextSVG            = Text
export const RectangleSVG       = Rectangle
export const SquareSVG          = Square
export const CircleSVG          = Circle
export const EraserSVG          = Eraser
export const GoogleSVG          = Google
export const GitHubSVG          = GitHub

export const Icons: {[key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>} = {
  "logo":              LogoSVG,
  "video":             VideoSVG,
  "video-slash":       VideoSlashSVG,
  "microphone":        MicrophoneSVG,
  "microphone-slash":  MicrophoneSlashSVG,
  "phone":             PhoneSVG,
  "chalkboard":        ChalkboardSVG,
  "comment-alt-lines": CommentAltLinesSVG,
  "cog":               CogSVG,
  "screen-full":       ScreenFullSVG,
  "screen-normal":     ScreenNormalSVG,
  "screen-enter":      ScreenEnterSVG,
  "screen-exit":       ScreenExitSVG,
  "screen-share":      ScreenShareSVG,
  "sign-out-alt":      SignOutAltSVG,
  "user-plus":         UserPlusSVG,
  "link":              LinkSVG,
  "paper-plane":       PaperPlaneSVG,
  "times":             TimesSVG,
  "layer":             LayerSVG,
  "images":            ImagesSVG,
  "globe":             GlobeSVG,
  "mouse-pointer":     MousePointerSVG,
  "pencil-alt":        PencilAltSVG,
  "text":              TextSVG,
  "rectangle":         RectangleSVG,
  "square":            SquareSVG,
  "circle":            CircleSVG,
  "eraser":            EraserSVG,
  "google":            GoogleSVG,
  "github":            GitHubSVG
}

for (const key in Icons) {
  if (Icons.hasOwnProperty(key)) {
    const icon = Icons[key]
    icon.defaultProps = {className: `icon icon-${key}`}
  }
}

export interface Props extends React.SVGProps<SVGSVGElement> {
  title?: string
  type:   string
}

// https://reactjs.org/docs/jsx-in-depth.html#choosing-the-type-at-runtime
const Icon = (options: Props) => {

  const Component = Icons[options.type]

  const attrs = {...options}
  delete attrs["type"]

  if (attrs.role === undefined) {
    attrs.role = "img"
  }

  return <Component {...attrs} />
}

export default Icon
