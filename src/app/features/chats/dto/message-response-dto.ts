export class MessageResponseDto {
  id: string;
  chatId: string;
  userId: string;
  message: string;
  createdAt: string;

  constructor(id: string, chatId: string, userId: string, message: string, createdAt: string) {
    this.id = id;
    this.chatId = chatId;
    this.userId = userId;
    this.message = message;
    this.createdAt = createdAt;
  }

  static fromJson(json: any): MessageResponseDto {
    return new MessageResponseDto(json.id, json.chatId, json.userId, json.message, json.createdAt);
  }
}
