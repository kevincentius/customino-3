import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { ChatMessage } from '@shared/model/room/chat-message';
import { RoomService } from 'app/game-server/room.service';
import { timeoutWrapper } from 'app/util/ng-zone-util';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainerComponent {
  @Input() roomId?: number;

  @Input() chatMessages!: ChatMessage[];

  @Input() chatMessageInput!: string;
  @Output() chatMessageInputChange = new EventEmitter<string>();
  

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;


  constructor(
    private roomService: RoomService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  onSubmitChat() {
    if (this.chatMessageInput.trim().length > 0) {
      this.roomService.postChatMessage(this.chatMessageInput);

      this.chatMessageInputChange.emit('');
    }
  }

  pushChatMessage(chatMessage: ChatMessage) {
    this.chatMessages.push(chatMessage);
    while (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }
    const el = this.chatScroll.nativeElement;
    const shouldAutoScroll = el.scrollHeight - el.scrollTop - el.clientHeight < 1
    this.cd.detectChanges();
    
    if (shouldAutoScroll) {
      timeoutWrapper(this.ngZone)(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }
}
