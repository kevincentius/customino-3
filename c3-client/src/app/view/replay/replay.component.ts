import { MainService } from "app/view/main/main.service";

import { ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FileDropAreaComponent } from "app/view/common/file-drop-area/file-drop-area.component";
import { GameReplayer } from "@shared/game/engine/replayer/game-replayer";
import { getLocalSettings } from "app/service/user-settings/user-settings.service";
import { timeoutWrapper } from "app/util/ng-zone-util";
import { MainScreen } from "../main/main-screen";
import { soundService } from "app/pixi/display/sound/sound-service";

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplayComponent {

  @ViewChild('pixiTarget')
  pixiTarget!: ElementRef<HTMLDivElement>;

  @ViewChild('fileDropArea')
  fileDropArea!: FileDropAreaComponent;

  replayer?: GameReplayer;

  framesExecuted = 0;

  running = false;

  constructor(
    private mainService: MainService,
    private ngZone: NgZone,
  ) { }

  onBackClick() {
    this.mainService.openScreen(MainScreen.MENU);
    soundService.play('back');
    console.log('play back sound man');
  }

  onFileChange(files: any) {
    if (files.length == 0) {
      return;
    }

    this.fileDropArea.clear();
    
    let fileReader = new FileReader();
    fileReader.onload = () => {
      this.startReplay(fileReader.result as string);
    }
    fileReader.readAsText(files[0]);
  }

  private startReplay(replayString: string) {
    const replay = JSON.parse(replayString);
    
    this.replayer = new GameReplayer(timeoutWrapper(this.ngZone), replay, getLocalSettings().localRule);
    this.replayer.start();
    this.running = true;
    
    this.mainService.pixi.bindGame(this.replayer.game);
  }

  onResumeClick() {
    this.replayer!.start();
    this.running = true;
  }

  onPauseClick() {
    this.replayer!.pause();
    this.running = false;
  }
}
