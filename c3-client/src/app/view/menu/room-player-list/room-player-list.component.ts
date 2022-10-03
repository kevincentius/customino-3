import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { RoomInfo } from '@shared/model/room/room-info';
import { RoomService } from 'app/game-server/room.service';
import { soloStyle, teamStyles } from 'app/style/team-styles';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-room-player-list',
  templateUrl: './room-player-list.component.html',
  styleUrls: ['./room-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomPlayerListComponent implements OnInit {
  @Input() roomInfo!: RoomInfo;

  displayComboCount = 5;

  @ViewChild('playerInfoMenuTrigger')
  playerInfoMenuTrigger!: MatMenuTrigger;

  constructor(
    private mainService: MainService,
    private roomService: RoomService,
  ) { }

  ngOnInit(): void {
  }

  // VIEW MODEL
  isHost() { return this.roomInfo.host != null && this.roomInfo.host.sessionId == this.mainService.sessionInfo.sessionId; }
  getSessionId() { return this.mainService.sessionInfo.sessionId; }

  getTeamTextColor(team: number | null) {
    return '#' + (team == null ? soloStyle : teamStyles[team]).roomTextColor.toString(16).padStart(6, '0');
  }

  getTeamBgColor(team: number | null) {
    return '#' + (team == null ? soloStyle : teamStyles[team]).roomIconColor.toString(16).padStart(6, '0');
  }
  // ----------

  onTeamIconClick(slotIndex: number) {
    if (this.isHost()) {
      const prevTeam = this.roomInfo.slots[slotIndex].settings.team;
      const team = prevTeam == null ? 0
        : prevTeam == teamStyles.length - 1 ? null
        : prevTeam + 1;

      this.roomService.changeSlotTeam(slotIndex, team);
    }
  }

  onRoomSlotRightClick(e: MouseEvent, slotIndex: number) {
    console.log('yo');
    this.playerInfoMenuTrigger.openMenu();
  }
}
