export interface IdempotentSendData {
  lease: Date;
  sent: boolean;
}

export interface EventData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
