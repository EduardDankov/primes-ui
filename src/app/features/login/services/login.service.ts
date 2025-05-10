import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {CreateUserRequestDto} from '../dto/create-user-request-dto';
import {catchError, map, Observable} from 'rxjs';
import {UserStatusResponseDto} from '../dto/user-status-response-dto';
import {ErrorDto} from '../../../core/dto/error-dto';
import * as API from '../../../core/constants/api.mapping';
import {UserStatus} from '../../../core/enums/user-status.enum';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private readonly http: HttpClient, private router: Router) { }

  public isAuthenticated() {
    return this.getToken() !== null && this.getUser() !== null;
  }

  public getToken() {
    return sessionStorage.getItem('token');
  }

  public getUser() {
    const user = sessionStorage.getItem('user');
    if (user === null) {
      return null;
    }
    return JSON.parse(user) as UserStatusResponseDto;
  }

  public updateToken(createUserDto: CreateUserRequestDto) {
    sessionStorage.setItem('token', createUserDto.username + ':' + createUserDto.password);
  }

  public updateUser(userStatusResponseDto: UserStatusResponseDto) {
    sessionStorage.setItem('user', JSON.stringify(userStatusResponseDto));
  }

  public login(createUserDto: CreateUserRequestDto): Observable<string> {
    if (this.isAuthenticated()) {
      alert(`Already logged in. Token: ${this.getToken()}`);
      return new Observable().pipe(map(() => this.getToken() as string));
    }

    return this.http.post<HttpResponse<any>>(
      API.getUrl(API.Mappings.LOGIN),
      createUserDto,
      { observe: 'response' }
    ).pipe(
      map(response => {
        const userStatusResponseDto: UserStatusResponseDto = UserStatusResponseDto.fromJson(response.body);
        if ([200].includes(response.status) && userStatusResponseDto.status === UserStatus.AUTHENTICATED) {
          this.updateToken(createUserDto);
          this.updateUser(userStatusResponseDto);
          return this.getToken() as string;
        } else {
          throw new ErrorDto('Wrong credentials');
        }
      }),
      catchError(error => {
        const errorDto: ErrorDto = ErrorDto.fromJson(error.error);
        throw new Error(errorDto.error);
      })
    );
  }

  public createUser(createUserDto: CreateUserRequestDto): Observable<string> {
    if (this.isAuthenticated()) {
      alert(`Already logged in. Token: ${this.getToken()}`);
      return new Observable().pipe(map(() => this.getToken() as string));
    }

    return this.http.post<HttpResponse<any>>(API.getUrl(API.Mappings.USER_CREATE), createUserDto, { observe: 'response' }).pipe(
      map(response => {
        if ([201].includes(response.status) && UserStatusResponseDto.fromJson(response.body).status === UserStatus.CREATED) {
          this.updateToken(createUserDto);
          this.updateUser(UserStatusResponseDto.fromJson(response.body));
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

  public logOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
