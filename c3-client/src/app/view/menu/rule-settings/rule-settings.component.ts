import { Component, Input, OnInit } from '@angular/core';
import { GameRule } from '@shared/game/engine/model/rule/game-rule';

@Component({
  selector: 'app-rule-settings',
  templateUrl: './rule-settings.component.html',
  styleUrls: ['./rule-settings.component.scss']
})
export class RuleSettingsComponent implements OnInit {
  @Input() gameRule!: GameRule;

  constructor() { }

  ngOnInit(): void {
  }

}
