import { useCallback, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { Group, Text, Box } from "metabase/ui";
import type { SmartScalarComparisonPeriodsAgo } from "metabase-types/api";
import type { COMPARISON_TYPES } from "metabase/visualizations/visualizations/SmartScalar/constants";
import { NumberInputStyled } from "./PeriodsAgoMenuOption.styled";
import { MenuItemStyled } from "./MenuItem.styled";
import type { HandleEditedValueChangeType } from "./SmartScalarSettingsWidgets";

type PeriodsAgoMenuOptionProps = {
  "aria-selected": boolean;
  editedValue?: SmartScalarComparisonPeriodsAgo;
  maxValue: number;
  name: string;
  onChange: HandleEditedValueChangeType;
  type: typeof COMPARISON_TYPES.PERIODS_AGO;
};

const MIN_VALUE = 2;

export function PeriodsAgoMenuOption({
  "aria-selected": isSelected,
  editedValue,
  maxValue,
  name,
  onChange,
  type,
}: PeriodsAgoMenuOptionProps) {
  // utilities for blurring and selecting the input whenever
  // validation fails so that the user can easily re-enter a valid value
  const inputRef = useRef<HTMLInputElement>(null);
  const selectInput = useCallback(() => {
    inputRef.current?.select();
  }, [inputRef]);
  const reSelectInput = useCallback(() => {
    inputRef.current?.blur();
    setTimeout(() => selectInput(), 0);
  }, [selectInput]);

  const value = editedValue?.value ?? MIN_VALUE;
  const handleInputChange = useCallback(
    (value: number) => {
      if (value < 1) {
        onChange({ type, value: MIN_VALUE });
        reSelectInput();
        return;
      }

      if (value > maxValue) {
        onChange({ type, value: maxValue });
        reSelectInput();
        return;
      }

      if (!Number.isInteger(value)) {
        onChange({ type, value: Math.floor(value) ?? MIN_VALUE });
        reSelectInput();
        return;
      }

      onChange({ type, value });
    },
    [maxValue, onChange, reSelectInput, type],
  );

  const handleInputEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onChange({ type, value }, true);
      }
    },
    [onChange, type, value],
  );
  const handleInputClick = useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      selectInput();
    },
    [selectInput],
  );

  return (
    <MenuItemStyled py="0.25rem" aria-selected={isSelected}>
      <Box onClick={() => onChange({ type, value }, true)}>
        <Group position="apart" px="0.5rem">
          <Text fw="bold">{`${value} ${name}`}</Text>
          <NumberInputStyled
            ref={inputRef}
            value={value}
            onChange={(value: number) => handleInputChange(value)}
            onKeyPress={handleInputEnter}
            onClick={handleInputClick}
            size="xs"
            w="3.5rem"
            type="number"
            required
          ></NumberInputStyled>
        </Group>
      </Box>
    </MenuItemStyled>
  );
}
