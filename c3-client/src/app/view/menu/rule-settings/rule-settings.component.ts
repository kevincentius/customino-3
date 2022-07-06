import { Component, Input, OnInit } from '@angular/core';
import { PlayerRuleField } from '@shared/game/engine/model/rule/field';
import { GameRule } from '@shared/game/engine/model/rule/game-rule';
import { PlayerRule } from '@shared/game/engine/model/rule/player-rule';
import { playerRuleFields } from '@shared/game/engine/model/rule/player-rule-fields';

@Component({
  selector: 'app-rule-settings',
  templateUrl: './rule-settings.component.html',
  styleUrls: ['./rule-settings.component.scss']
})
export class RuleSettingsComponent implements OnInit {
  playerRuleFields = playerRuleFields;

  @Input() gameRule!: GameRule;
  @Input() editMode = false;

  displayedRule!: any;

  constructor() { }

  ngOnInit(): void {
    this.displayedRule = this.gameRule.globalRule;
  }

  getFieldValue(field: PlayerRuleField) {
    return (this.gameRule.globalRule as any)[field.property];
  }
  
  onSaveRuleClick() {
    
  }
}
