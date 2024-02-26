import {
  EntityInfo,
  useEntityUpdate,
} from "metabase/common/hooks/use-entity-update";
import Databases from "metabase/entities/databases";
import Database from "metabase-lib/metadata/Database";
import { DatabaseData, DatabaseId } from "metabase-types/api";

export const useDatabaseUpdate = () => {
  return useEntityUpdate<
    DatabaseId,
    Database,
    EntityInfo<DatabaseId>,
    DatabaseData
  >({
    update: Databases.actions.update,
    getObject: Databases.selectors.getObject,
  });
};
