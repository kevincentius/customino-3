import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService, GameMode, LeaderboardEntry, LeaderboardService } from 'app/main-server/api/v1';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  gameModes!: GameMode[];
  gameMode!: GameMode;
  entries!: LeaderboardEntry[];

  constructor(
    private readonly mainService: MainService,
    private readonly leaderboardService: LeaderboardService,
    private readonly dataService: DataService,

    private cd: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.gameModes = (await this.dataService.getGlobalData()).gameModes;

    console.log(this.gameModes);
    await this.showGameMode(this.gameModes[0]);
  }

  async showGameMode(gameMode: GameMode) {
    this.gameMode = gameMode;
    const gameModeSeason = (await this.dataService.getGlobalData()).gameModeSeasons
      .filter(season => season.gameModeId == this.gameMode.id)
      .sort((a, b) => a.id - b.id)[0];
    this.entries = await this.leaderboardService.getLeaderboardEntries(gameModeSeason.id, 0);
    this.entries = [...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries, ...this.entries]

    this.cd.detectChanges();
  }

  onBackClick() {
    this.mainService.back();
    soundService.play('back');
  }

  onGameModeToggleClick() {
    this.gameMode = this.gameModes[(this.gameModes.indexOf(this.gameMode) + 1) % this.gameModes.length];
  }
}
