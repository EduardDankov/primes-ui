import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CreateUserDto} from '../dto/create-user-dto';
import {catchError, map, Observable} from 'rxjs';
import {UserStatusResponseDto} from '../dto/user-status-response-dto';
import {ErrorDto} from '../../../core/dto/error-dto';
import * as API from '../../../core/constants/api.mapping';
import {UserStatus} from '../../../core/enums/user-status.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private readonly http: HttpClient) { }

  private getToken() {
    return sessionStorage.getItem('token');
  }

  private updateToken(createUserDto: CreateUserDto) {
    console.log('setting token')
    sessionStorage.setItem('token', createUserDto.username + ':' + createUserDto.password);
  }

  public login(createUserDto: CreateUserDto): Observable<string> {
    if (this.getToken() !== null) {
      alert(`Already logged in. Token: ${this.getToken()}`);
      return new Observable().pipe(map(() => this.getToken() as string));
    }

    return this.http.post<HttpResponse<any>>(API.getUrl(API.Mappings.LOGIN), createUserDto, { observe: 'response' }).pipe(
      map(response => {
        console.dir(response);
        if ([200].includes(response.status) && UserStatusResponseDto.fromJson(response.body).status === UserStatus.AUTHENTICATED) {
          this.updateToken(createUserDto);
          return this.getToken() as string;
        } else {
          throw response;
        }
      }),
      catchError(error => {
        const errorDto: ErrorDto = ErrorDto.fromJson(error.error);
        throw new Error(errorDto.error);
      })
    );
  }
}
