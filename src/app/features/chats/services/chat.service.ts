import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {ChatResponseDto} from '../dto/chat-response-dto';
import {LoginService} from '../../login/services/login.service';
import * as API from '../../../core/constants/api.mapping';
import {ErrorDto} from '../../../core/dto/error-dto';
import {UserResponseDto} from '../../profile/dto/user-response-dto';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private readonly loginService: LoginService, private readonly http: HttpClient) { }

  public getChats(): Observable<Array<ChatResponseDto>> {
    const user: UserStatusResponseDto = this.loginService.getUser()!;
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    })

    return this.http.get(
      API.getUrl(API.Mappings.CHAT_GET_ALL, [user.id]),
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        console.dir(response);
        if ([200].includes(response.status)) {
          return (response.body as Array<any>).map((chat: any) => ChatResponseDto.fromJson(chat));
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
