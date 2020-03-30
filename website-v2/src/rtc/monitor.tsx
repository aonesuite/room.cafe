import React from "react"
import { UID } from "agora-rtc-sdk-ng"

export interface IMonitorOptions {
  uid: UID
}

export function Monitor(option: IMonitorOptions) {
  return (
    <div id={`monitor-${option.uid}`}></div>
  )
}
