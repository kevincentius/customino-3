import { Component, Input, OnInit } from '@angular/core';
import { DataField } from '@shared/game/engine/model/rule/data-field/data-field';
import { FieldTags } from '@shared/game/engine/model/rule/data-field/field-tag';
import { GameRule } from '@shared/game/engine/model/rule/game-rule';
import { playerRuleFields } from '@shared/game/engine/model/rule/room-rule/player-rule-fields';
import { getField, setField } from '@shared/game/engine/model/rule/data-field/data-field';
import { RulePreset, rulePresets } from 'app/view/menu/rule-settings/rule-presets';
import { saveAs } from 'file-saver';

interface ViewMode {
  name: string;
  forbiddenTags: FieldTags[];
  allowCategories: boolean;
  hideRuleFields?: boolean;
}
const viewModes: ViewMode[] = [
  {
    name: 'Presets mode',
    forbiddenTags: [ FieldTags.ALL, FieldTags.ADVANCED, FieldTags.BASIC, ],
    allowCategories: false,
    hideRuleFields: true,
  },
  {
    name: 'Simple mode',
    forbiddenTags: [ FieldTags.ALL, FieldTags.ADVANCED, ],
    allowCategories: false,
  },
  {
    name: 'Advanced mode',
    forbiddenTags: [ FieldTags.ALL, ],
    allowCategories: true,
  },
  {
    name: 'View all',
    forbiddenTags: [],
    allowCategories: true,
  }
];

interface RuleCategory {
  name: string;
  fields: DataField[];
}
const categoryDatas: RuleCategoryData[] = [
  {
    name: 'Graphics',
    tag: FieldTags.GFX_GLOBAL,
  },
  {
    name: 'General',
    tag: FieldTags.GENERAL,
  },
  {
    name: 'Attack',
    tag: FieldTags.ATTACK,
  },
  {
    name: 'Defense',
    tag: FieldTags.DEFENSE,
  },
  {
    name: 'Debug',
    tag: FieldTags.DEBUG,
  },
  {
    name: 'Others',
  }
];

interface RuleCategoryData {
  name: string;
  tag?: FieldTags;
}
const categories: RuleCategory[] = categoryDatas.map(d => ({...d, fields: []}));
for (let field of playerRuleFields) {
  for (let i = 0; i < categoryDatas.length; i++) {
    if (!categoryDatas[i].tag || field.tags.indexOf(categoryDatas[i].tag!) != -1) {
      categories[i].fields.push(field);
      break;
    }
  }
}


@Component({
  selector: 'app-rule-settings',
  templateUrl: './rule-settings.component.html',
  styleUrls: ['./rule-settings.component.scss']
})
export class RuleSettingsComponent implements OnInit {
  playerRuleFields = playerRuleFields;
  presets: RulePreset[] = rulePresets;

  @Input() gameRule!: GameRule;
  @Input() editMode = false;
  @Input() localMode = false;

  displayedRule!: any;
  viewMode = viewModes[0];
  categories = categories;
  groupByCategory = true;
  selectedPreset?: RulePreset = rulePresets[0];

  constructor() { }

  ngOnInit(): void {
    this.displayedRule = this.gameRule.roomRule;
  }

  getFieldValue(field: DataField) {
    return getField(this.displayedRule, field);
  }

  setFieldValue(field: DataField, value: any) {
    setField(this.displayedRule, field, value);
  }

  toggleViewMode() {
    this.viewMode = viewModes[(viewModes.indexOf(this.viewMode) + 1) % viewModes.length]

    if (this.viewMode != viewModes[0]) {
      this.selectedPreset = undefined;
    }
  }

  toggleCategories() {
    this.groupByCategory = !this.groupByCategory;
  }
  
  passesFilter(field: DataField) {
    return this.viewMode.forbiddenTags.every(forbiddenTag => field.tags.indexOf(forbiddenTag) == -1);
  }
  
  onDownloadClick() {
    saveAs(new Blob([JSON.stringify(this.gameRule)]), 'custom-game.rule');
  }

  async onRuleUpload(files: File[]) {
    const gameRule = await this.readFileAsJsObject(files[0]);
    this.loadRule(gameRule);
  }

  private loadRule(gameRule: GameRule) {
    const unknownProperties: string[] = [];
    for (const key of Object.keys(gameRule.roomRule)) {
      if (key in this.gameRule.roomRule) {
        (this.gameRule.roomRule as any)[key] = (gameRule.roomRule as any)[key];
      } else {
        unknownProperties.push(key);
      }
    }

    if (unknownProperties.length != 0) {
      alert(`Warning: unknown rule properties were found and ignored - ${unknownProperties.join(', ')}`);
    }
  }

  private async readFileAsJsObject(file: File): Promise<GameRule> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.readyState != 2) return;
        if (e.target.error) {
          alert('Error while reading file');
          return;
        }
  
        const content = e.target.result as string;
        resolve(JSON.parse(content));
      }
      reader.readAsText(file);
    });
  }

  onPresetClick(preset: RulePreset) {
    this.selectedPreset = preset;
    this.loadRule(JSON.parse(preset.json));
  }
}
