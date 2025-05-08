import {Component, ElementRef} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ChatService} from '../services/chat.service';
import {UserResponseDto} from '../../profile/dto/user-response-dto';
import {interval, Subscription} from 'rxjs';
import {ProfileService} from '../../profile/services/profile.service';
import {ErrorDto} from '../../../core/dto/error-dto';
import {ChatResponseDto} from '../dto/chat-response-dto';
import {UserStatusResponseDto} from '../../login/dto/user-status-response-dto';
import {CreateChatRequestDto} from '../dto/create-chat-request-dto';
import {ChatStatusResponseDto} from '../dto/chat-status-response-dto';
import {MessageResponseDto} from '../dto/message-response-dto';
import {ChatWindowComponent} from '../chat-window/chat-window.component';

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
  private chatMessages: Map<string, Array<MessageResponseDto>> = new Map();
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
    const userId: string = chat.createdBy === this.profileService.getUser().id ? chat.createdWith : chat.createdBy;
    const username: string = this.users.find(user => user.id === userId)?.username || 'Unknown';
    return `${username} (ID: ${userId})`;
  }

  getChatStatus(user: UserResponseDto): string {
    if (this.profileService.getUser().id === user.id) {
      return 'You';
    }
    const chat: ChatResponseDto | undefined = this.chats.find(chat => chat.createdBy === user.id || chat.createdWith === user.id);
    if (chat) {
      return 'Chat created';
    }
    return 'No chat yet';
  }

  formatChatLatestMessage(chat: ChatResponseDto): string {
    const message: MessageResponseDto | null = this.getChatLatestMessage(chat.id);
    if (message === null) {
      return 'No messages yet';
    }
    if (message.userId === this.user.id) {
      return `You: ${message.message}`;
    }
    return message.message;
  }

  formatChatLatestMessageTime(chat: ChatResponseDto): string {
    const message: MessageResponseDto | null = this.getChatLatestMessage(chat.id);
    if (message === null) {
      return '';
    }
    return this.formatMessageTimestamp(message.timestamp);
  }

  private formatMessageTimestamp(timestamp: Date): string {
    return Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'medium'}).format(timestamp);
  }

  private getChatLatestMessage(chatId: string): MessageResponseDto | null {
    const messages: Array<MessageResponseDto> | undefined = this.chatMessages.get(chatId);
    if (messages === undefined || messages.length === 0) {
      return null;
    }
    return messages[messages.length - 1];
  }

  createChatWith(user: UserResponseDto) {
    if (this.doesChatExistWith(user)) {
      const message: string = `Chat with ${user.username} already exists`;
      console.log(message);
      return;
    }
    const request: CreateChatRequestDto = new CreateChatRequestDto(this.user.id, user.id);
    this.chatService.createChat(request).subscribe({
      next: (response: ChatStatusResponseDto) => {
        this.updateChats();
        const message: string = `Chat with ${user.username} successfully created`;
        console.log(message);
      },
      error: (error: ErrorDto) => {
        const message: string = `Chat creation failed. Error: ${error.error}`;
        console.log(message);
      }
    });
  }

  private doesChatExistWith(user: UserResponseDto): boolean {
    return this.chats.find(chat => chat.createdWith == user.id || chat.createdBy == user.id) !== undefined;
  }

  private updateChats() {
    this.chatService.getChats().subscribe({
      next: (response: Array<ChatResponseDto>) => {
        this.chats = response;
        this.chatsToRender = this.chats;
        this.search();
        this.updateMessages();
        const message: string = `Chats successfully updated`;
        console.log(message);
      },
      error: (error: ErrorDto) => {
        const message: string = `Chat update failed, retrying in a minute. Error: ${error.error}`;
        console.log(message);
      }
    });
  }

  private updateMessages() {
    this.chatMessages.clear();
    this.chats.forEach(chat => {
      this.chatService.getMessagesForChat(chat.id).subscribe({
        next: (response: Array<MessageResponseDto>) => {
          this.chatMessages.set(chat.id, response);
        },
        error: (error: ErrorDto) => {
          const message: string = `Message update failed. Error: ${error.error}`;
          console.log(message);
        }
      });
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
