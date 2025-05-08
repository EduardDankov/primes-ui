import {Component, ElementRef} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ChatService} from '../services/chat.service';
import {UserResponseDto} from '../../profile/dto/user-response-dto';
import {interval, Subscription} from 'rxjs';
import {ProfileService} from '../../profile/services/profile.service';
import {ErrorDto} from '../../../core/dto/error-dto';
import {ChatResponseDto} from '../dto/chat-response-dto';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';

@Component({
  selector: 'app-chat-list',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  private user: UserStatusResponseDto;

  private chatInterval = interval(60000)
  private chatSubscription: Subscription;
  private chats: Array<ChatResponseDto> = [];
  chatsToRender: Array<ChatResponseDto> = []

  private userInterval = interval(60000)
  private userSubscription: Subscription;
  private users: Array<UserResponseDto> = [];
  usersToRender: Array<UserResponseDto> = []

  isInUserListMode: boolean = false;

  constructor(
    private readonly chatService: ChatService,
    private readonly profileService: ProfileService,
    private elRef: ElementRef
  ) {
    this.elRef = elRef;
    this.user = this.profileService.getUser();
    this.updateChats();
    this.chatSubscription = this.chatInterval.subscribe(val => this.updateChats());
    this.updateUsers();
    this.userSubscription = this.userInterval.subscribe(val => this.updateUsers());
  }

  search() {
    const pattern: string = this.elRef.nativeElement.querySelector('.chat-search>input').value.toLowerCase();
    this.chatsToRender = this.chats.filter(chat => {
      const isChatCreatedByUser: boolean = chat.createdWith.toLowerCase().includes(pattern) && chat.createdWith !== this.user.id;
      const isChatCreatedWithUser: boolean = chat.createdBy.toLowerCase().includes(pattern) && chat.createdBy !== this.user.id;
      const isChatWithSelf: boolean = chat.createdWith.toLowerCase().includes(pattern) && chat.createdBy.toLowerCase().includes(pattern);
      return isChatCreatedByUser || isChatCreatedWithUser || isChatWithSelf;
    });

    this.usersToRender = this.users.filter(user => {
      const isMatchingUsername: boolean = user.username.toLowerCase().includes(pattern);
      const isMatchingId: boolean = user.id.toLowerCase().includes(pattern);
      return isMatchingUsername || isMatchingId;
    });
  }

  onUserIconClick() {
    this.isInUserListMode = !this.isInUserListMode;
    this.elRef.nativeElement.querySelector('.chat-search>.user-icon').classList.toggle('selected');
  }

  getChatUser(chat: ChatResponseDto): string {
    return chat.createdBy === this.profileService.getUser().id ? chat.createdWith : chat.createdBy;
  }

  getChatStatus(user: UserResponseDto): string {
    if (this.profileService.getUser().id === user.id) {
      return 'You';
    }
    const chat: ChatResponseDto | undefined = this.chats.find(chat => chat.createdBy === user.id || chat.createdWith === user.id);
    if (chat) {
      return 'Created';
    }
    return 'No chat yet';
  }

  private updateChats() {
    this.chatService.getChats().subscribe({
      next: (response: Array<ChatResponseDto>) => {
        this.chats = response;
        this.chatsToRender = this.chats;
        this.search();
        const message: string = `Chats successfully updated`;
        console.log(message);
      },
      error: (error: ErrorDto) => {
        const message: string = `Chat update failed, retrying in a minute. Error: ${error.error}`;
        console.log(message);
      }
    });
  }

  private updateUsers() {
    this.profileService.getUsers().subscribe({
      next: (response: Array<UserResponseDto>) => {
        this.users = response.sort((a, b) => a.username.localeCompare(b.username));
        this.usersToRender = this.users;
        this.search();
        const message: string = `Users successfully updated`;
        console.log(message);
      },
      error: (error: ErrorDto) => {
        const message: string = `User update failed, retrying in a minute. Error: ${error.error}`;
        console.log(message);
      }
    });
  }
}
