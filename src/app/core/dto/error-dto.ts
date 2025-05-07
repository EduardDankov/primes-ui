export class ErrorDto {
  error: string;

  constructor(error: string) {
    this.error = error;
  }

  static fromJson(json: any): ErrorDto {
    return new ErrorDto(json.error);
  }
}
