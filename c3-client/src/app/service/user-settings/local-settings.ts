import { UserRule } from "@shared/game/engine/model/rule/user-rule/user-rule";
import { LocalRule } from "@shared/game/engine/model/rule/local-rule/local-rule";
import { ControlSettings } from "app/service/user-settings/control-settings";

export interface LocalSettings {
  control: ControlSettings;
  musicVolume: number;
  soundVolume: number;
  userRule: UserRule;
  localRule: LocalRule;
}
