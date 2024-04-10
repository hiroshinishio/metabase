import { useCallback, useLayoutEffect, useState } from "react";
import { t } from "ttag";

import type { EmbeddingParameterVisibility } from "metabase/public/lib/types";
import { Radio, Stack, Text, TextInput, Box, Select } from "metabase/ui";
import { canUseCustomSource } from "metabase-lib/v1/parameters/utils/parameter-source";
import { parameterHasNoDisplayValue } from "metabase-lib/v1/parameters/utils/parameter-values";
import type {
  Parameter,
  ValuesQueryType,
  ValuesSourceConfig,
  ValuesSourceType,
} from "metabase-types/api";

import { getIsMultiSelect } from "../../utils/dashboards";
import { isSingleOrMultiSelectable } from "../../utils/parameter-type";
import { RequiredParamToggle } from "../RequiredParamToggle";
import { ValuesSourceSettings } from "../ValuesSourceSettings";

import {
  SettingLabel,
  SettingLabelError,
  SettingValueWidget,
} from "./ParameterSettings.styled";
import { getDashboardParameterSections } from "metabase/parameters/utils/dashboard-options";
import { getParameterType } from "metabase-lib/v1/parameters/utils/parameter-type";

export interface ParameterSettingsProps {
  parameter: Parameter;
  isParameterSlugUsed: (value: string) => boolean;
  onChangeName: (name: string) => void;
  onChangeType: (type: string) => void;
  onChangeDefaultValue: (value: unknown) => void;
  onChangeIsMultiSelect: (isMultiSelect: boolean) => void;
  onChangeQueryType: (queryType: ValuesQueryType) => void;
  onChangeSourceType: (sourceType: ValuesSourceType) => void;
  onChangeSourceConfig: (sourceConfig: ValuesSourceConfig) => void;
  onChangeRequired: (value: boolean) => void;
  embeddedParameterVisibility: EmbeddingParameterVisibility | null;
}

const parameterSections = getDashboardParameterSections();
const dataTypeOptions = parameterSections.map(section => {
  return {
    label: section.name,
    value: section.id
  }
})

export const ParameterSettings = ({
  parameter,
  isParameterSlugUsed,
  onChangeName,
  onChangeDefaultValue,
  onChangeIsMultiSelect,
  onChangeQueryType,
  onChangeSourceType,
  onChangeSourceConfig,
  onChangeType,
  onChangeRequired,
  embeddedParameterVisibility,
}: ParameterSettingsProps): JSX.Element => {
  const [tempLabelValue, setTempLabelValue] = useState(parameter.name);
  const [dataType, setDataType] = useState(getParameterType(parameter));

  useLayoutEffect(() => {
    setTempLabelValue(parameter.name);
    // onChangeType(parameter.type);
  }, [onChangeType, parameter]);

  const labelError = getLabelError({
    labelValue: tempLabelValue,
    isParameterSlugUsed,
  });

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempLabelValue(event.target.value);
  };

  const handleLabelBlur = (event: { target: HTMLInputElement }) => {
    if (labelError) {
      // revert to the value before editing
      setTempLabelValue(parameter.name);
    } else {
      onChangeName(event.target.value);
    }
  };

  const handleDataTypeChange = (nextType: string) => {
    onChangeType(nextType);
  }

  const handleSourceSettingsChange = useCallback(
    (sourceType: ValuesSourceType, sourceConfig: ValuesSourceConfig) => {
      onChangeSourceType(sourceType);
      onChangeSourceConfig(sourceConfig);
    },
    [onChangeSourceType, onChangeSourceConfig],
  );

  const isEmbeddedDisabled = embeddedParameterVisibility === "disabled";
  const isMultiValue = getIsMultiSelect(parameter) ? "multi" : "single";

  return (
    <Box p="1.5rem 1rem">
      <Box mb="xl">
        <SettingLabel>{t`Label`}</SettingLabel>
        <TextInput
          onChange={handleLabelChange}
          value={tempLabelValue}
          onBlur={handleLabelBlur}
          error={labelError}
          aria-label={t`Label`}
        />
      </Box>
      <Box mb="xl">
        <SettingLabel>{t`Data type`}</SettingLabel>
        <Select
          data={dataTypeOptions}
          value={dataType}
          onChange={handleDataTypeChange}
        // value={tempLabelValue}
        // onBlur={handleLabelBlur}
        // error={labelError}
        // aria-label={t`Label`}
        />
      </Box>
      {canUseCustomSource(parameter) && (
        <Box mb="xl">
          <SettingLabel>{t`How should people filter on this column?`}</SettingLabel>
          <ValuesSourceSettings
            parameter={parameter}
            onChangeQueryType={onChangeQueryType}
            onChangeSourceSettings={handleSourceSettingsChange}
          />
        </Box>
      )}

      {isSingleOrMultiSelectable(parameter) && (
        <Box mb="xl">
          <SettingLabel>{t`People can pick`}</SettingLabel>
          <Radio.Group
            value={isMultiValue}
            onChange={val => onChangeIsMultiSelect(val === "multi")}
          >
            <Stack spacing="xs">
              <Radio
                checked={isMultiValue === "multi"}
                label={t`Multiple values`}
                value="multi"
              />
              <Radio
                checked={isMultiValue === "single"}
                label={t`A single value`}
                value="single"
              />
            </Stack>
          </Radio.Group>
        </Box>
      )}

      <Box mb="lg">
        <SettingLabel>
          {t`Default value`}
          {parameter.required &&
            parameterHasNoDisplayValue(parameter.default) && (
              <SettingLabelError>({t`required`})</SettingLabelError>
            )}
        </SettingLabel>

        <SettingValueWidget
          parameter={parameter}
          name={parameter.name}
          value={parameter.default}
          placeholder={t`No default`}
          setValue={onChangeDefaultValue}
          mimicMantine
        />

        <RequiredParamToggle
          // This forces the toggle to be a new instance when the parameter changes,
          // so that toggles don't slide, which is confusing.
          key={`required_param_toggle_${parameter.id}`}
          uniqueId={parameter.id}
          disabled={isEmbeddedDisabled}
          value={parameter.required ?? false}
          onChange={onChangeRequired}
          disabledTooltip={
            <>
              <Text lh={1.4}>
                {t`This filter is set to disabled in an embedded dashboard.`}
              </Text>
              <Text lh={1.4}>
                {t`To always require a value, first visit embedding settings,
                    make this filter editable or locked, re-publish the
                    dashboard, then return to this page.`}
              </Text>
              <Text size="sm">
                {t`Note`}:{" "}
                {t`making it locked, will require updating the
                    embedding code before proceeding, otherwise the embed will
                    break.`}
              </Text>
            </>
          }
        ></RequiredParamToggle>
      </Box>
    </Box>
  );
};

function getLabelError({
  labelValue,
  isParameterSlugUsed,
}: {
  labelValue: string;
  isParameterSlugUsed: (value: string) => boolean;
}) {
  if (!labelValue) {
    return t`Required`;
  }
  if (isParameterSlugUsed(labelValue)) {
    return t`This label is already in use.`;
  }
  if (labelValue.toLowerCase() === "tab") {
    return t`This label is reserved for dashboard tabs.`;
  }
  return null;
}
