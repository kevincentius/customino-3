import { Component, OnInit } from '@angular/core';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { credits } from 'app/view/menu/thanks/credits';

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
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit {

  credits = credits;

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

  onBackClick() {
    this.mainService.openScreen(MainScreen.MENU);
  }
}
