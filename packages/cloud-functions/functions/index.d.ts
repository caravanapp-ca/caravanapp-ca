export interface IdempotentSendData {
  lease: Date;
  sent: boolean;
}
