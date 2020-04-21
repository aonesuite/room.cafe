import React, { useState } from "react"

import{ ReactComponent as VideoSVG } from "./Video.svg"                     // 摄像头
import{ ReactComponent as VideoSlashSVG } from "./VideoSlash.svg"           // 摄像头(禁用)
import{ ReactComponent as MicrophoneSVG } from "./Microphone.svg"           // 麦克风
import{ ReactComponent as MicrophoneSlashSVG } from "./MicrophoneSlash.svg" // 麦克风(禁用)
import{ ReactComponent as PhoneSVG } from "./Phone.svg"                     // 电话
import{ ReactComponent as ChalkboardSVG } from "./Chalkboard.svg"           // 黑板
import{ ReactComponent as CommentAltLinesSVG } from "./CommentAltLines.svg" // 评论，消息
import{ ReactComponent as CogSVG } from "./Cog.svg"                         // 齿轮，设置
import{ ReactComponent as ScreenFullSVG } from "./ScreenFull.svg"           // 进入全屏
import{ ReactComponent as ScreenNormalSVG } from "./ScreenNormal.svg"       // 退出全屏
import{ ReactComponent as ScreenEnterSVG } from "./ScreenEnter.svg"         // 进入全屏
import{ ReactComponent as ScreenExitSVG } from "./ScreenExit.svg"           // 退出全屏
import{ ReactComponent as ScreenShareSVG } from "./ScreenShare.svg"         // 屏幕分享
import{ ReactComponent as SignOutAltSVG } from "./SignOutAlt.svg"           // 退出
import{ ReactComponent as UserPlusSVG } from "./UserPlus.svg"               // 添加用户
import{ ReactComponent as LinkSVG } from "./Link.svg"                       // 链接
import{ ReactComponent as PaperPlaneSVG } from "./PaperPlane.svg"           // 发送
import{ ReactComponent as TimesSVG } from "./Times.svg"                     // 叉，关闭
import{ ReactComponent as LayerSVG } from "./Layer.svg"                     // 图层
import{ ReactComponent as ImagesSVG } from "./Images.svg"                   // 图层
import{ ReactComponent as GlobeSVG } from "./Globe.svg"                     // 地球
import{ ReactComponent as MousePointerSVG } from "./MousePointer.svg" // 默认鼠标， 选择工具
import{ ReactComponent as PencilAltSVG } from "./PencilAlt.svg"       // 铅笔
import{ ReactComponent as TextSVG } from "./Text.svg"                 // 文字
import{ ReactComponent as RectangleSVG } from "./Rectangle.svg"       // 矩形
import{ ReactComponent as SquareSVG } from "./Square.svg"             // 正方形
import{ ReactComponent as CircleSVG } from "./Circle.svg"             // 圆形
import{ ReactComponent as EraserSVG } from "./Eraser.svg"             // 橡皮擦
import{ ReactComponent as GoogleSVG } from "./Google.svg"             // Google
import{ ReactComponent as GitHubSVG } from "./GitHub.svg"             // GitHub

export interface IOptions {
  type: string
}

const Icon = (options: IOptions) => {

  const [element, setElement] = useState("")

  return (
    <React.Fragment>
      {
        element
      }
    </React.Fragment>
  )
}

export default Icon

{/* <component role="img" :class="`icon icon-${type}`" v-bind:is="currentIcon"></component>

<style lang="scss">
.phone-hang-up{
  transform: rotate(0.6251turn);
}
.flip-horizontal{
  transform: scaleX(-1);
}
.icon[rotate='45']{
  transform: rotate(45deg);
}
</style> */}
