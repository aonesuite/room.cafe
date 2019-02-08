import * as QNRTC from "pili-rtc-web";
import { Stream } from '@/types/stream';
import { RTCUser } from '@/types/user';

export class RTC extends QNRTC.TrackModeSession {

  public streams: Stream[] = [];

  public constructor() {
    super()

    this.autoSubscribe(this.trackInfoList);
    this.on("track-add", this.autoSubscribe);
  }

  // 查找房间中用户
  public findUser(userId: string): QNRTC.User{
    return this.users.find(u => u.userId === userId) || new QNRTC.User(userId);
  }

  // 自动订阅房间中已发布的 track， 并归整到对应的 stream 中
  public async autoSubscribe(trackInfoList: QNRTC.TrackBaseInfo[]) {
    const trackIds = trackInfoList.map(info => info.trackId || '');
    const tracks = await this.subscribe(trackIds);

    for (const track of tracks) {
      const stream = this.streams.find((stream: Stream) => {
        return stream.user.userId === track.userId && stream.tag === track.info.tag;
      })

      if (stream) {
        stream.addTracks([track])
      } else {
        const user = this.findUser(track.userId || '');
        this.streams.push(new Stream([track], "recv", user, track.info.tag))
      }
    }
  }

}
