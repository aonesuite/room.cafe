import EventEmitter from "wolfy87-eventemitter";
import * as QNRTC from "pili-rtc-web";
import { RTCUser } from '@/types/user';

export class Stream extends EventEmitter {

  public trackList: QNRTC.Track[] = [];
  private direction: "send" | "recv";

  public userId: string;
  public user: RTCUser;
  public tag?: string;
  public id: string;

  /**
   * 用于标记这个流是否调用了 release 方法，即表示这个流已经被释放
   */
  public isDestroyed: boolean = false;

  public audioTrack?: QNRTC.Track;
  public videoTrack?: QNRTC.Track;

  public constructor(tracks: QNRTC.Track[], direction: "send" | "recv" = "send", user: QNRTC.User, tag?: string) {
    super();

    this.direction = direction;
    this.userId = user.userId;
    this.user = new RTCUser(user.userId, user.userData);
    this.tag = tag;

    this.addTracks(tracks);

    this.id = `${this.userId}_${this.tag}`;
  }

  public addTracks(tracks: QNRTC.Track[]): void {
    for (const track of tracks) {
      const index = this.trackList.findIndex(t => t.info.trackId === track.info.trackId);
      if (index >= 0) continue;
      this.trackList.push(track);
      if (this.tag === "" || this.tag === undefined) this.tag = track.info.tag || "master";
      if (track.info.kind === "video") this.videoTrack = track;
      if (track.info.kind === "audio") this.audioTrack = track;

      track.on("release", () => {
        this.removeTrack(track);
      })
    }
  }

  /**
   * 释放 stream 的 track
   * @param track
   */
  private removeTrack(track: QNRTC.Track) {
    const index = this.trackList.findIndex(t => t.info.trackId === track.info.trackId);

    if (index < 0) return;

    this.trackList.splice(index, 1);

    if (track.info.kind === "video") this.videoTrack = undefined;
    if (track.info.kind === "audio") this.audioTrack = undefined;

    // 如果自己所有的 track 都 release 了，自己也 release
    if (this.trackList.length === 0) {
      this.release();
    }
  }

  /**
   * 释放这个流下的所有资源，包括流和用于播放流的媒体元素
   */
  public release(): void {
    if (this.isDestroyed) {
      return;
    }

    for (let i = 0; i < this.trackList.length; i += 1) {
      const track = this.trackList[i];
      track.release();
    }

    this.trackList = [];
    this.isDestroyed = true;
    this.emit("release");
    this.removeEvent();
  }
}
