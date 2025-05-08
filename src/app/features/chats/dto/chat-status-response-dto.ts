import {ChatStatus} from '../../../core/enums/chat-status.enum';

export class ChatStatusResponseDto {
  status: ChatStatus;
  id: string;
  createdBy: string;
  createdWith: string;

  constructor(status: ChatStatus, id: string, createdBy: string, createdWith: string) {
    this.status = status;
    this.id = id;
    this.createdBy = createdBy;
    this.createdWith = createdWith;
  }

  static fromJson(json: any): ChatStatusResponseDto {
    return new ChatStatusResponseDto(json.status, json.id, json.createdBy, json.createdWith);
  }
}
