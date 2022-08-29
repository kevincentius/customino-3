import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DataField } from '@shared/game/engine/model/rule/data-field/data-field';
import { GameRule } from '@shared/game/engine/model/rule/game-rule';
import { getField, setField } from '@shared/game/engine/model/rule/data-field/data-field';
import { RulePreset, rulePresets } from 'app/view/menu/rule-settings/rule-presets';
import { saveAs } from 'file-saver';
import { UserRule } from '@shared/game/engine/model/rule/user-rule/user-rule';
import { ViewMode, viewModeAdvanced, viewModeAll, viewModePresets, viewModeSimple, viewModeSimpleCategorized } from 'app/view/menu/rule-settings/rule-settings-view-mode';
import { createCategories, DataFieldCategory, DataFieldCategoryData } from 'app/view/menu/rule-settings/rule-settings-category';
import { LocalRule } from '@shared/game/engine/model/rule/local-rule/local-rule';

@Component({
  selector: 'app-rule-settings',
  templateUrl: './rule-settings.component.html',
  styleUrls: ['./rule-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleSettingsComponent implements OnInit {
  presets: RulePreset[] = rulePresets;

  // required inputs
  @Input() editMode = false;
  @Input() dataFieldCategories!: DataFieldCategoryData[];
  
  // required inputs for Room Settings (i. e. GameRule)
  @Input() gameRule?: GameRule;
  @Input() dataFields!: DataField[];

  // requiredinputs for User Settings
  @Input() userRule?: UserRule;
  @Input() userRuleFields?: DataField[];
  @Input() localRule?: LocalRule;
  @Input() localRuleFields?: DataField[];

  userRuleFieldSet!: Set<DataField>;

  viewModes!: ViewMode[];
  viewMode!: ViewMode;
  categories!: DataFieldCategory[];
  
  displayedRule!: any;
  groupByCategory = true;
  selectedPreset?: RulePreset = rulePresets[0];
  
  ngOnInit(): void {
    if (this.gameRule) {
      this.viewModes = [viewModePresets, viewModeSimple, viewModeAdvanced, viewModeAll];
    } else {
      this.dataFields = [...this.userRuleFields!, ...this.localRuleFields!];
      this.viewModes = [viewModeSimpleCategorized, viewModeAdvanced, viewModeAll]
      this.userRuleFieldSet = new Set(this.userRuleFields!);
    }
    
    this.viewMode = this.viewModes[0];
    this.categories = createCategories(this.dataFieldCategories, this.dataFields);
    this.displayedRule = this.gameRule?.roomRule ?? undefined;
  }

  getFieldValue(field: DataField) {
    return getField(this.getBoundRule(field), field);
  }

  setFieldValue(field: DataField, value: any) {
    setField(this.getBoundRule(field), field, value);
  }

  private getBoundRule(field: DataField) {
    return this.gameRule ? this.displayedRule
      : this.userRuleFieldSet.has(field) ? this.userRule!
      : this.localRule!;
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
