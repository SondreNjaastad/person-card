import { EntityConfig } from "custom-card-helpers";

export function processEditorEntities(entities): EntityConfig[] {
  return entities.map((entityConf) => {
    if (typeof entityConf === "string") {
      return { entity: entityConf };
    }
    return entityConf;
  });
}