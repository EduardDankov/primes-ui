export class CreateChatRequestDto {
  createdBy: string;
  createdWith: string;

  constructor(createdBy: string, createdWith: string) {
    this.createdBy = createdBy;
    this.createdWith = createdWith;
  }

  static fromJson(json: any): CreateChatRequestDto {
    return new CreateChatRequestDto(json.createdBy, json.createdWith);
  }
}
