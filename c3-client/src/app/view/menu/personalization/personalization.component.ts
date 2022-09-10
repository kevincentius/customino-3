import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FieldTags } from '@shared/game/engine/model/rule/data-field/field-tag';
import { localRuleFields } from '@shared/game/engine/model/rule/local-rule/local-rule-fields';
import { userRuleFields } from '@shared/game/engine/model/rule/user-rule/user-rule-fields';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { LocalSettings } from 'app/service/user-settings/local-settings';
import { getLocalSettings, UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { MainService } from 'app/view/main/main.service';
import { DataFieldCategoryData } from 'app/view/menu/rule-settings/rule-settings-category';

@Component({
  selector: 'app-personalization',
  templateUrl: './personalization.component.html',
  styleUrls: ['./personalization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalizationComponent implements OnInit {

  userRuleFields = userRuleFields;
  localRuleFields = localRuleFields;
  dataFieldCategories: DataFieldCategoryData[] = [
    {
      name: 'General',
      tag: FieldTags.GFX_GLOBAL,
    },
    {
      name: 'Line clear',
      tag: FieldTags.LINE_CLEAR_EFFECTS
    }
  ]
  
  localSettings!: LocalSettings;

  onBackClick() {
    this.mainService.back();
    soundService.play('back');
  }
  
  constructor(
    private userSettingsService: UserSettingsService,
    private mainService: MainService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.userSettingsService.onLoad(() => {
      this.localSettings = getLocalSettings();
      this.cd.detectChanges();
    });
  }

}
