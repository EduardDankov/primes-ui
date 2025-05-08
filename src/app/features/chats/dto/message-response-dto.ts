export class MessageResponseDto {
  id: string;
  chatId: string;
  userId: string;
  message: string;
  timestamp: Date;

  constructor(id: string, chatId: string, userId: string, message: string, timestamp: Date) {
    this.id = id;
    this.chatId = chatId;
    this.userId = userId;
    this.message = message;
    this.timestamp = timestamp;
  }

  static fromJson(json: any): MessageResponseDto {
    return new MessageResponseDto(json.id, json.chatId, json.userId, json.message, json.timestamp);
  }
}
