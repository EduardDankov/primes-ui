import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {ChatResponseDto} from '../dto/chat-response-dto';
import {LoginService} from '../../login/services/login.service';
import * as API from '../../../core/constants/api.mapping';
import {ErrorDto} from '../../../core/dto/error-dto';
import {UserResponseDto} from '../../profile/dto/user-response-dto';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';
import {CreateChatRequestDto} from '../dto/create-chat-request-dto';
import {ChatStatusResponseDto} from '../dto/chat-status-response-dto';
import {MessageResponseDto} from '../dto/message-response-dto';
import {CreateMessageRequestDto} from "../dto/create-message-request-dto";
import {MessageStatusResponseDto} from "../dto/message-status-response-dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private readonly loginService: LoginService, private readonly http: HttpClient) { }

  public createChat(chat: CreateChatRequestDto): Observable<ChatStatusResponseDto> {
    const user: UserStatusResponseDto = this.loginService.getUser()!;
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    });

    return this.http.post(
      API.getUrl(API.Mappings.CHAT_CREATE),
      chat,
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        if ([201].includes(response.status)) {
          return ChatStatusResponseDto.fromJson(response.body);
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

  public getChats(): Observable<Array<ChatResponseDto>> {
    const user: UserStatusResponseDto = this.loginService.getUser()!;
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    });

    return this.http.get(
      API.getUrl(API.Mappings.CHAT_GET_ALL, [user.id]),
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
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

  public getMessagesForChat(chat: string): Observable<Array<MessageResponseDto>> {
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    });

    return this.http.get(
      API.getUrl(API.Mappings.MESSAGE_GET_ALL, [chat]),
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        if ([200].includes(response.status)) {
          return (response.body as Array<any>).map((message: any) => MessageResponseDto.fromJson(message));
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

  public sendMessage(message: CreateMessageRequestDto): Observable<MessageStatusResponseDto> {
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Authorization": `Bearer ${this.loginService.getToken()}`,
      "Content-Type": "application/json",
    });

    return this.http.post(
      API.getUrl(API.Mappings.MESSAGE_CREATE),
      message,
      {headers: headers, observe: 'response'}
    ).pipe(
      map(response => {
        if ([201].includes(response.status)) {
          return MessageStatusResponseDto.fromJson(response.body);
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
