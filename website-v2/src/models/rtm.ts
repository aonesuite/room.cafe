
export type IRtmMessage = IRtmTextMessage | IRtmRawMessage

export interface IRtmTextMessage {
  text: string

  messageType?: "TEXT"
  rawMessage?:  never
  description?: never
}

export interface IRtmRawMessage {
  rawMessage:   Uint8Array
  description?: string
  messageType?: "RAW"
  text?:        never
}

export interface IReceiveMessageProperties {
  serverReceivedTs: number
  isOfflineMessage: boolean
}