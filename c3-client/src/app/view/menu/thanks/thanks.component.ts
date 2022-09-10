import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { musicCredits } from 'app/view/menu/thanks/music-credits';
import { soundCredits } from 'app/view/menu/thanks/sound-credits';

export interface CreditItem {
  name: string;
  author?: string;
  license?: string;
  url?: string;
  note?: string;
}

export interface CreditGroup {
  name: string;
  description: string;
  url: string;

  items: CreditItem[];
}

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThanksComponent implements OnInit {

  credits = [ soundCredits, musicCredits ];

  constructor(
    private mainService: MainService
  ) { }

  ngOnInit(): void {
  }

  onItemClick(item: CreditItem) {
    if (item.url) {
      window.open(item.url);
    }
  }

  onHeaderClick(credit: CreditGroup) {
    if (credit.url) {
      window.open(credit.url);
    }
  }

  onBackClick() {
    this.mainService.openScreen(MainScreen.MENU);
    soundService.play('back');
  }
}
