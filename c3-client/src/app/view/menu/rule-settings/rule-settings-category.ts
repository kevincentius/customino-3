import { DataField } from "@shared/game/engine/model/rule/data-field/data-field";
import { FieldTags } from "@shared/game/engine/model/rule/data-field/field-tag";

export interface DataFieldCategoryData {
  name: string;
  tag?: FieldTags;
}

export interface DataFieldCategory {
  name: string;
  fields: DataField[];
}

export function createCategories(categoryDatas: DataFieldCategoryData[], dataFields: DataField[]) {
  const categories: DataFieldCategory[] = categoryDatas.map(d => ({...d, fields: []}));
  for (let field of dataFields) {
    for (let i = 0; i < categoryDatas.length; i++) {
      if (!categoryDatas[i].tag || field.tags.indexOf(categoryDatas[i].tag!) != -1) {
        categories[i].fields.push(field);
        break;
      }
    }
  }
  return categories;
}
