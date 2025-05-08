import { Injectable } from '@angular/core';
import {LoginService} from '../../login/services/login.service';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';
import {CreateUserRequestDto} from '../../login/dto/create-user-request-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as API from '../../../core/constants/api.mapping';
import {catchError, map, Observable} from 'rxjs';
import {UserStatus} from '../../../core/enums/user-status.enum';
import {ErrorDto} from '../../../core/dto/error-dto';
import {UserResponseDto} from '../dto/user-response-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private readonly loginService: LoginService, private http: HttpClient) {
  }

  public getUser(): UserStatusResponseDto {
    const user = this.loginService.getUser();
    if (user === null) {
      throw new Error('User not found');
    }
    return user;
  }

  public getUsers(): Observable<Array<UserResponseDto>> {
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    })

    return this.http.get(
      API.getUrl(API.Mappings.USER_GET_ALL),
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        console.dir(response);
        if ([200].includes(response.status)) {
          return (response.body as Array<any>).map((user: any) => UserResponseDto.fromJson(user));
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

  public updateUser(updatedUser: CreateUserRequestDto): Observable<string> {
    const user = this.loginService.getUser()!;
    updatedUser = this.validateUser(updatedUser, user);
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    })

    return this.http.put(
      API.getUrl(API.Mappings.USER_UPDATE, [user.id]),
      updatedUser,
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        console.dir(response);
        if ([200].includes(response.status) && UserStatusResponseDto.fromJson(response.body).status === UserStatus.UPDATED) {
          this.loginService.updateToken(updatedUser);
          this.loginService.updateUser(UserStatusResponseDto.fromJson(response.body));
          return this.loginService.getToken() as string;
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

  public deleteUser(confirmation: string): Observable<string> {
    const [_, password] = this.loginService.getToken()?.split(':')!;
    if (confirmation !== password) {
      throw new Error('Password does not match');
    }

    const user = this.loginService.getUser()!;
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    })

    return this.http.delete(
      API.getUrl(API.Mappings.USER_DELETE, [user.id]),
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        console.dir(response);
        if ([204].includes(response.status)) {
          this.loginService.logOut();
          return 'Profile deleted successfully';
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
    this.loginService.logOut();
  }

  private validateUser(updatedUser: CreateUserRequestDto, currentUser: UserStatusResponseDto): CreateUserRequestDto {
    const [username, password] = this.loginService.getToken()?.split(':')!;
    if (updatedUser.username === null || updatedUser.username.trim() === '') {
      updatedUser.username = username ?? currentUser.username;
    }
    if (updatedUser.password === null || updatedUser.password.trim() === '') {
      updatedUser.password = password;
    }
    return updatedUser;
  }
}
