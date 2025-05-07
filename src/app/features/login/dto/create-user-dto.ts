export class CreateUserDto {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  static fromJson(json: any): CreateUserDto {
    return new CreateUserDto(json.username, json.password);
  }
}
