import { Component, Input, OnInit } from '@angular/core';
import { DataField } from '@shared/game/engine/model/rule/data-field/data-field';
import { GameRule } from '@shared/game/engine/model/rule/game-rule';
import { playerRuleFields } from '@shared/game/engine/model/rule/room-rule/player-rule-fields';
import { getField, setField } from '@shared/game/engine/model/rule/data-field/data-field';
import { RulePreset, rulePresets } from 'app/view/menu/rule-settings/rule-presets';
import { saveAs } from 'file-saver';
import { LocalRule } from '@shared/game/engine/model/rule/local-rule/local-rule';
import { ViewMode, viewModeAdvanced, viewModeAll, viewModePresets, viewModeSimple } from 'app/view/menu/rule-settings/rule-settings-view-mode';
import { createCategories, DataFieldCategory, DataFieldCategoryData } from 'app/view/menu/rule-settings/rule-settings-category';

@Component({
  selector: 'app-rule-settings',
  templateUrl: './rule-settings.component.html',
  styleUrls: ['./rule-settings.component.scss']
})
export class RuleSettingsComponent implements OnInit {
  playerRuleFields = playerRuleFields;
  presets: RulePreset[] = rulePresets;

  // either gameRule OR localRule must be provided by the parent
  @Input() gameRule?: GameRule;
  @Input() localRule?: LocalRule;
  @Input() editMode = false;
  @Input() dataFields!: DataField[];
  @Input() dataFieldCategories!: DataFieldCategoryData[];
  
  viewModes!: ViewMode[];
  viewMode!: ViewMode;
  categories!: DataFieldCategory[];
  
  displayedRule!: any;
  groupByCategory = true;
  selectedPreset?: RulePreset = rulePresets[0];
  
  constructor() {
  }

  ngOnInit(): void {
    this.viewModes = this.gameRule != null
      ? [viewModePresets, viewModeSimple, viewModeAdvanced, viewModeAll]
      : [viewModeSimple, viewModeAdvanced, viewModeAll];
    this.viewMode = this.viewModes[0];
    console.log('hello', this.dataFieldCategories);
    this.categories = createCategories(this.dataFieldCategories, this.dataFields);
    
    this.displayedRule = this.gameRule?.roomRule ?? this.localRule!;
  }

  getFieldValue(field: DataField) {
    return getField(this.displayedRule, field);
  }

  setFieldValue(field: DataField, value: any) {
    setField(this.displayedRule, field, value);
  }

  toggleViewMode() {
    this.viewMode = this.viewModes[(this.viewModes.indexOf(this.viewMode) + 1) % this.viewModes.length]

    if (!this.viewMode.hideRuleFields) {
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
    const data = await this.readFileAsJsObject(files[0]);
    this.loadRule(data);
  }

  private loadRule(data: any) {
    const unknownProperties: string[] = [];
    for (const key of Object.keys(data.roomRule)) {
      if (this.gameRule && key in this.gameRule!.roomRule) {
        (this.gameRule!.roomRule as any)[key] = data.roomRule[key];
      } else if (this.localRule && key in this.localRule) {
        (this.localRule as any)[key] = data[key];
      } else {
        unknownProperties.push(key);
      }
    }

    if (unknownProperties.length != 0) {
      alert(`Warning: unknown rule properties were found and ignored - ${unknownProperties.join(', ')}`);
    }
  }

  private async readFileAsJsObject(file: File): Promise<any> {
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
