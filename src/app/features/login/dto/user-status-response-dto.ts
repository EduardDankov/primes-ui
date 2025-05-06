import {UserStatus} from '../../../core/enums/user-status.enum';

export class UserStatusResponseDto {
  status: UserStatus;
  id: string;
  username: string;

  constructor(status: UserStatus, id: string, username: string) {
    this.status = status;
    this.id = id;
    this.username = username;
  }

  static fromJson(json: any): UserStatusResponseDto {
    return new UserStatusResponseDto(
      json.status,
      json.id,
      json.username
    );
  }
}
