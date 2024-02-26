import MetabaseSettings from "metabase/lib/settings";
import type { Settings } from "metabase-types/api";
import { createMockSettings } from "metabase-types/api/mocks";
import { createMockSettingsState } from "metabase-types/store/mocks";

export function mockSettings(params: Partial<Settings> = {}) {
  const settings = createMockSettings(params);
  const state = createMockSettingsState(settings);

  MetabaseSettings.setAll(settings);

  return state;
}
