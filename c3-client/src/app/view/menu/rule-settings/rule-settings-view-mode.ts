import { FieldTags } from "@shared/game/engine/model/rule/data-field/field-tag";

export interface ViewMode {
  name: string;
  forbiddenTags: FieldTags[];
  allowCategories: boolean;
  hideRuleFields?: boolean;
}
export const viewModePresets = {
  name: 'Presets mode',
  forbiddenTags: [ FieldTags.ALL, FieldTags.ADVANCED, FieldTags.BASIC, ],
  allowCategories: false,
  hideRuleFields: true,
};
export const viewModeSimple = 
{
  name: 'Simple mode',
  forbiddenTags: [ FieldTags.ALL, FieldTags.ADVANCED, ],
  allowCategories: false,
};
export const viewModeSimpleCategorized = 
{
  name: 'Simple mode',
  forbiddenTags: [ FieldTags.ALL, FieldTags.ADVANCED, ],
  allowCategories: true,
};
export const viewModeAdvanced = {
  name: 'Advanced mode',
  forbiddenTags: [ FieldTags.ALL, ],
  allowCategories: true,
};
export const viewModeAll = {
  name: 'Unfiltered',
  forbiddenTags: [],
  allowCategories: true,
};
