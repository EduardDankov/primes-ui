import { Component } from '@angular/core';
import {ChatListComponent} from './chat-list/chat-list.component';
import {ChatWindowComponent} from './chat-window/chat-window.component';

@Component({
  selector: 'app-chats',
  imports: [
    ChatListComponent,
    ChatWindowComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  selectedChat: string | null = null;

  onSelectChat(chatId: string) {
    console.log(`Selected chat ID: ${chatId}`);
    this.selectedChat = chatId;
  }

  onCloseChat() {
    console.log('Chat closed');
    this.selectedChat = null;
  }
}
