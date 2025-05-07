import { Injectable } from '@angular/core';
import {LoginService} from '../../login/services/login.service';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';
import {CreateUserDto} from '../../login/dto/create-user-dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as API from '../../../core/constants/api.mapping';
import {catchError, map, Observable} from 'rxjs';
import {UserStatus} from '../../../core/enums/user-status.enum';
import {ErrorDto} from '../../../core/dto/error-dto';

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

  public updateUser(updatedUser: CreateUserDto): Observable<string> {
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

  private validateUser(updatedUser: CreateUserDto, currentUser: UserStatusResponseDto): CreateUserDto {
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
