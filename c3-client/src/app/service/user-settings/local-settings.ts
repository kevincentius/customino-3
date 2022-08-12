import { ControlSettings } from "app/service/user-settings/control-settings";
import { LocalGraphicsSettings } from "app/service/user-settings/local-graphics-settings";

export interface LocalSettings {
  control: ControlSettings;
  musicVolume: number;
  soundVolume: number;
  localGraphics: LocalGraphicsSettings;

  
}
