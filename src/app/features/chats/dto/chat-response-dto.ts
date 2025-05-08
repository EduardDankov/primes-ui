export class ChatResponseDto {
  id: string;
  createdBy: string;
  createdWith: string;

  constructor(id: string, createdBy: string, createdWith: string) {
    this.id = id;
    this.createdBy = createdBy;
    this.createdWith = createdWith;
  }

  static fromJson(json: any): ChatResponseDto {
    return new ChatResponseDto(json.id, json.createdBy, json.createdWith);
  }
}
