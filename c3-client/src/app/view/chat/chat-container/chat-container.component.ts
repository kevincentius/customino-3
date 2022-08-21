import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatMessage } from '@shared/model/room/chat-message';
import { RoomService } from 'app/game-server/room.service';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent {
  @Input() roomId?: number;
  @Input() chatMessageInput!: string;
  @Output() chatMessageInputChange = new EventEmitter<string>();

  chatMessages: ChatMessage[] = [];

  constructor(
    private roomService: RoomService,
  ) {}

  onSubmitChat() {
    if (this.chatMessageInput.trim().length > 0) {
      this.roomService.postChatMessage(this.chatMessageInput);

      this.chatMessageInput = '';
    }
  }

  pushChatMessage(chatMessage: ChatMessage) {
    this.chatMessages.push(chatMessage);
    while (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }
  }
}