import {Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {MessageResponseDto} from '../dto/message-response-dto';
import {NgForOf, NgIf} from '@angular/common';
import {CreateMessageRequestDto} from "../dto/create-message-request-dto";
import {ProfileService} from "../../profile/services/profile.service";
import {UserResponseDto} from "../../profile/dto/user-response-dto";
import {MessageStatusResponseDto} from "../dto/message-status-response-dto";

@Component({
  selector: 'app-chat-window',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnChanges {
  private users: Array<UserResponseDto> = [];
  messages: Array<MessageResponseDto> = [];

  @Input() selectedChat: string | null = null;

  constructor(private readonly chatService: ChatService, private readonly profileService: ProfileService, private elRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedChat']) {
      this.updateUsers();
      this.updateMessages(this.selectedChat);
    }
  }

  formatUsername(message: MessageResponseDto): string {
    const user: UserResponseDto | undefined = this.users.find(user => user.id === message.userId);
    if (user === undefined) {
      return 'Unknown';
    }
    return user.username;
  }

  formatMessageTimestamp(message: MessageResponseDto): string {
    const timestamp: Date = new Date(message.createdAt);
    return Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'medium'}).format(timestamp);
  }

  sendMessage() {
    const inputField = this.elRef.nativeElement.querySelector('.message-create>input');
    const chatId: string = this.selectedChat!;
    if (inputField.value.trim().length === 0) {
      alert('Message cannot be empty');
    }
    const request: CreateMessageRequestDto = new CreateMessageRequestDto(chatId, inputField.value);

    this.chatService.sendMessage(request).subscribe({
      next: (response: MessageStatusResponseDto) => {
        inputField.value = '';
        this.updateMessages(chatId);
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  private updateUsers() {
    this.profileService.getUsers().subscribe({
      next: (users: Array<UserResponseDto>) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  private updateMessages(chatId: string | null): void {
    if (chatId === null) {
      this.messages = [];
      return;
    }
    this.chatService.getMessagesForChat(chatId).subscribe({
      next: (messages: Array<MessageResponseDto>) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      }
    });
  }
}
