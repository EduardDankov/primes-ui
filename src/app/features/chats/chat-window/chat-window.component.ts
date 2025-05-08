import { Component } from '@angular/core';
import {ChatService} from '../services/chat.service';
import {MessageResponseDto} from '../dto/message-response-dto';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-chat-window',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent {
  messages: Array<MessageResponseDto> = [
    new MessageResponseDto('1', '1', '1','Hello, how can I help you?', new Date()),
    new MessageResponseDto('2', '1', '1','I am looking for a product.', new Date()),
    new MessageResponseDto('3', '1', '1','Sure, what kind of product are you looking for?', new Date()),
    new MessageResponseDto('4', '1', '1','I am looking for a laptop.', new Date()),
    new MessageResponseDto('5', '1', '1','We have a great selection of laptops. What is your budget?', new Date()),
    new MessageResponseDto('6', '1', '1','I am looking for a laptop under $1000.', new Date()),
    new MessageResponseDto('7', '1', '1','We have a few options under $1000. Would you like to see them?', new Date()),
    new MessageResponseDto('8', '1', '1','Yes, please.', new Date()),
  ];

  constructor(private readonly chatService: ChatService) { }

  formatMessageTimestamp(timestamp: Date): string {
    return Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'medium'}).format(timestamp);
  }

  sendMessage() {
    alert('Patience, my friend! This feature is still under construction.');
  }
}
