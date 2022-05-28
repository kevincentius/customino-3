import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoomInfo } from '@shared/model/room/room-info';
import { RoomService } from 'app/game-server/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  private roomId!: number;
  roomInfo!: RoomInfo;

  private subscription!: Subscription;

  constructor(
    private roomService: RoomService,
  ) { }

  ngOnInit() {
    this.subscription = this.roomService.roomInfoSubject.subscribe(roomInfo => {
      if (this.roomId == roomInfo.id) {
        this.roomInfo = roomInfo;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async show(roomId: number) {
    this.roomId = roomId;
    this.roomInfo = (await this.roomService.getRoomInfo(roomId))!;
  }
}
