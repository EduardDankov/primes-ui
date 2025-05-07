import {Component, ElementRef} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

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
  isInUserListMode: boolean = false;

  constructor(private elRef: ElementRef) {
    this.elRef = elRef;
  }

  onUserIconClick() {
    this.isInUserListMode = !this.isInUserListMode;
    this.elRef.nativeElement.querySelector('.chat-search>.user-icon').classList.toggle('selected');
  }
}
