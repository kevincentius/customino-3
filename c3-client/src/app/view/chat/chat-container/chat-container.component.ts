import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatMessage } from '@shared/model/room/chat-message';
import { RoomService } from 'app/game-server/room.service';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainerComponent {
  @Input() roomId?: number;
  @Input() chatMessageInput!: string;
  @Output() chatMessageInputChange = new EventEmitter<string>();

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

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
    
    const el = this.chatScroll.nativeElement;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 1) {
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }
}
