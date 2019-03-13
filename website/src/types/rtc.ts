import * as QNRTC from "pili-rtc-web";
import { Stream } from '@/types/stream';
import { RTCUser } from '@/types/user';
import { ChatMessage } from './message';
import { CustomMessage } from 'pili-rtc-web';

if (process.env.NODE_ENV === "production") {
  QNRTC.log.level = "disable";
}

export class RTC extends QNRTC.TrackModeSession {

  public streams: Stream[] = [];
  public exited: boolean = false;

  public constructor() {
    super();
  }

  // overwrite joinRoomWithToken method 加入房间
  public joinRoomWithToken(roomToken: string, user?: any): Promise<QNRTC.User[]> {

    const timestamp = Math.round(new Date().getTime() / 1000);
    const data = Object.assign({}, user, { timestamp: timestamp });
    const userData = JSON.stringify(data);

    return super.joinRoomWithToken(roomToken, userData).then((users: QNRTC.User[]) => {

      this.autoSubscribe(this.trackInfoList);
      this.on("track-add", this.autoSubscribe);
      return users;
    });
  }

  // 查找房间中用户
  public findUser(userId: string): QNRTC.User{
    return this.users.find(u => u.userId === userId) || new QNRTC.User(userId);
  }

  // 当前用户
  public currentUser(): RTCUser {
    const rtcUser = this.findUser(this.userId as string);
    return new RTCUser(rtcUser.userId, rtcUser.userData);
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
      let stream = this.streams.find((stream: Stream) => {
        return stream.userId === track.userId && stream.tag === track.info.tag;
      });

      if (stream) {
        stream.addTracks([track])
      } else {
        const user = this.findUser(track.userId || '');
        stream = new Stream([track], direction, user, track.info.tag);
        this.streams.push(stream);

        stream.on("release", () => {
          this.removeStream(stream);
        });
      }
    }
  }

  // push stream to streams cache
  public push(stream: Stream): void {
    const index = this.streams.findIndex((s: Stream) => {
      return stream.userId === stream.userId && s.tag === stream.tag;
    });

    if (index < 0) {
      this.streams.push(stream);

      stream.on("release", () => {
        this.removeStream(stream);
      });
    }
  }

  // overwrite publish method 发布
  public publish(tracks: QNRTC.Track[]): Promise<void> {
    return super.publish(tracks).then(() => {
      this.addTracks(tracks, "send");
    })
  }

  // 取消发布指定 tag 和 kind 的 track
  public unpublishWithTag(tag: string, kind?: string) {
    const tracks = this.publishedTracks.filter(t => {
      return kind ? (t.info.tag === tag && t.info.kind === kind) : t.info.tag === tag;
    })

    const trackIds = tracks.map(t => t.info.trackId || "" );

    return this.unpublish(trackIds);
  }

  // overwrite unpublish method 取消发布
  public unpublish(trackIds: string[]) {
    const tracks = this.publishedTracks.filter(t => trackIds.includes(t.info.trackId || ""));
    return super.unpublish(trackIds).then(() => {
      for (const track of tracks) {
        track.release();
      }
    });
  }

  // 释放 stream 清理 streams
  private removeStream(stream: Stream | undefined) {
    if (stream === undefined) return;
    const index = this.streams.findIndex(s => s.userId === stream.userId && s.tag === stream.tag);
    if (index >= 0) this.streams.splice(index, 1);
  }

  // 将本地发布的 stream 静音
  public muteStream(tag: string, kind: string, muted: boolean) {
    const stream = this.streams.find(stream => stream.tag === tag && stream.userId === this.userId);

    if (stream === undefined) return;

    if (kind === "audio" && stream.audioTrack) {
      this.muteTracks([{ trackId: stream.audioTrack.info.trackId as string, muted: muted }]);
    }

    if (kind === "video" && stream.videoTrack) {
      this.muteTracks([{ trackId: stream.videoTrack.info.trackId as string, muted: muted }]);
    }
  }

  // overwrite leaveRoom method 离开房间
  public async leaveRoom() {
    const tracks = this.publishedTracks
    await this.unpublish(this.publishedTracks.map(track => track.info.trackId || ""));

    for (const track of tracks) {
      await track.release()
    }

    const streams = this.streams.filter(stream => stream.userId === this.userId);
    for (const stream of streams) {
      await stream.release();
    }

    super.leaveRoom();
    this.exited = true;

    this.emit("leaveRoom")
  }

  public encodeChatMessage(content: string): ChatMessage {
    const message = new ChatMessage({
      userId: this.userId as string,
      timestamp: new Date().getTime(),
      content: content,
    });

    message.user = this.currentUser();
    return message;
  }

  public parseChatMessage(message: CustomMessage): ChatMessage {
    const msg = JSON.parse(message.data)
    const rtcUser = this.findUser(message.userId);
    const user = new RTCUser(rtcUser.userId, rtcUser.userData);

    const chatMessage = new ChatMessage({
      userId: msg.userId,
      timestamp: new Date().getTime(),
      content: msg.content,
    });

    chatMessage.user = user;
    return chatMessage;
  }
}
