import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '@shared/model/room/chat-message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() chatMessage!: ChatMessage;
  

  constructor() { }

  ngOnInit(): void {
  }

}
