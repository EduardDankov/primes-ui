export class CreateMessageRequestDto {
  chatId: string;
  message: string;

  constructor(chatId: string, message: string) {
    this.chatId = chatId;
    this.message = message;
  }

  static fromJson(json: any): CreateMessageRequestDto {
    return new CreateMessageRequestDto(json.chatId, json.message);
  }
}
