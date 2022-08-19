import { Component, OnInit } from '@angular/core';
import { FieldTags } from '@shared/game/engine/model/rule/data-field/field-tag';
import { localRuleFields } from '@shared/game/engine/model/rule/local-rule/local-rule-fields';
import { userRuleFields } from '@shared/game/engine/model/rule/user-rule/user-rule-fields';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { getLocalSettings, UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { MainService } from 'app/view/main/main.service';
import { DataFieldCategoryData } from 'app/view/menu/rule-settings/rule-settings-category';

@Component({
  selector: 'app-personalization',
  templateUrl: './personalization.component.html',
  styleUrls: ['./personalization.component.scss']
})
export class PersonalizationComponent implements OnInit {

  userRuleFields = userRuleFields;
  localRuleFields = localRuleFields;
  dataFieldCategories: DataFieldCategoryData[] = [
    {
      name: 'Graphics',
      tag: FieldTags.GFX_GLOBAL,
    }
  ]
  
  localSettings!: LocalSettings;

  onBackClick() {
    this.mainService.back();
  }
  
  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      console.log(getLocalSettings());
      this.localSettings = getLocalSettings();
    });
  }

}
