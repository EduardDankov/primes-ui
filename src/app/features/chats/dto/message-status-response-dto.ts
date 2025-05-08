import {MessageStatus} from '../../../core/enums/message-status.enum';

export class MessageStatusResponseDto {
  status: MessageStatus;
  id: string;
  chatId: string;
  userId: string;
  message: string;
  createdAt: string;

  constructor(status: MessageStatus, id: string, chatId: string, userId: string, message: string, createdAt: string) {
    this.status = status;
    this.id = id;
    this.chatId = chatId;
    this.userId = userId;
    this.message = message;
    this.createdAt = createdAt;
  }

  static fromJson(json: any): MessageStatusResponseDto {
    return new MessageStatusResponseDto(json.status, json.id, json.chatId, json.userId, json.message, json.createdAt);
  }
}
