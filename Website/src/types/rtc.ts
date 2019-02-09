import * as QNRTC from "pili-rtc-web";
import { Stream } from '@/types/stream';

// QNRTC.log.level = "disable";

export class RTC extends QNRTC.TrackModeSession {

  public streams: Stream[] = [];

  public constructor() {
    super();
  }

  // overwrite joinRoomWithToken method
  public joinRoomWithToken(roomToken: string, user?: any): Promise<QNRTC.User[]> {

    const timestamp = Math.round(new Date().getTime() / 1000);
    const data = Object.assign({}, user, { timestamp: timestamp });
    const userData = JSON.stringify(data);

    return super.joinRoomWithToken(roomToken, userData).then((users: QNRTC.User[]) => {

      this.autoSubscribe(this.trackInfoList);
      this.on("track-add", this.autoSubscribe);
      this.on("track-remove", this.removeTracks);
      return users;
    });
  }

  // 查找房间中用户
  public findUser(userId: string): QNRTC.User{
    return this.users.find(u => u.userId === userId) || new QNRTC.User(userId);
  }

  // 自动订阅房间中已发布的 track， 并归整到对应的 stream 中
  public async autoSubscribe(trackInfoList: QNRTC.TrackBaseInfo[]) {
    const trackIds = trackInfoList.map(info => info.trackId || '');
    const tracks = await this.subscribe(trackIds);
    this.addTracks(tracks);
  }

  // 向房间中增加 track，归整到对应的 stream 中
  private addTracks(tracks: QNRTC.Track[], direction: "send" | "recv" = "recv") {
    for (const track of tracks) {

      // eslint-disable-next-line
      console.log("add tracks", track);
      /* eslint-disable */

      let stream = this.streams.find((stream: Stream) => {
        return stream.user.userId === track.userId && stream.tag === track.info.tag;
      });

      if (stream) {
        stream.addTracks([track])
      } else {
        const user = this.findUser(track.userId || '');
        stream = new Stream([track], direction, user, track.info.tag);
        this.streams.push(stream);

        stream.on("release", () => {
          this.releaseStream(stream);
        });
      }
    }

    // eslint-disable-next-line
    console.log("streams:", this.streams);
    /* eslint-disable */
  }

  // 移除房间中的 track，清理对应的 stream
  private removeTracks(trackInfoList: QNRTC.TrackBaseInfo[]) {

  }

  // push stream to streams cache
  public push(stream: Stream): void {
    const index = this.streams.findIndex((s: Stream) => {
      return stream.user.userId === stream.user.userId && s.tag === stream.tag;
    });

    if (index < 0) {
      this.streams.push(stream);

      stream.on("release", () => {
        this.releaseStream(stream);
      });
    }
  }

  // overwrite publish method
  public publish(tracks: QNRTC.Track[]): Promise<void> {
    return super.publish(tracks).then(() => {
      this.addTracks(tracks, "send");
    })
  }

  // 释放 stream 清理 streams
  public releaseStream(stream: Stream | undefined) {
    if (stream === undefined) return;
    const index = this.streams.findIndex(s => s.user.userId === stream.user.userId && s.tag === stream.tag);
    if (index >= 0) this.streams.splice(index, 1);
  }

}
