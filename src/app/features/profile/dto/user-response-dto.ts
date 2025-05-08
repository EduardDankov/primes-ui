export class UserResponseDto {
  id: string;
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }

  static fromJson(json: any): UserResponseDto {
    return new UserResponseDto(
      json.id,
      json.username
    );
  }
}
