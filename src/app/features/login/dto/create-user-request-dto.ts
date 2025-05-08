export class CreateUserRequestDto {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static fromJson(json: any): CreateUserRequestDto {
    return new CreateUserRequestDto(json.username, json.password);
  }
}
