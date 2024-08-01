import type { TooltipOption } from "echarts/types/dist/shared";
import { renderToString } from "react-dom/server";

import { EChartsTooltip } from "metabase/visualizations/components/ChartTooltip/EChartsTooltip";
import type { ComputedVisualizationSettings } from "metabase/visualizations/types";
import {
  getAxisTooltipData,
  getItemTooltipData,
} from "metabase/visualizations/visualizations/CartesianChart/events";

import type { BaseCartesianChartModel, DataKey } from "../model/types";

import S from "./tooltip.module.css";

interface ChartItemTooltip {
  dataIndex: number;
  seriesId: DataKey;
  settings: ComputedVisualizationSettings;
  chartModel: BaseCartesianChartModel;
}

const ChartItemTooltip = ({
  chartModel,
  settings,
  dataIndex,
  seriesId,
}: ChartItemTooltip) => {
  if (dataIndex == null) {
    return null;
  }

  const tooltipData =
    seriesId == null
      ? getAxisTooltipData(chartModel, settings, dataIndex)
      : getItemTooltipData(chartModel, settings, dataIndex, seriesId);
  if (!tooltipData) {
    return null;
  }

  return <EChartsTooltip {...tooltipData} />;
};

export const getTooltipOption = (
  chartModel: BaseCartesianChartModel,
  settings: ComputedVisualizationSettings,
): TooltipOption => {
  return {
    trigger: "axis",
    appendToBody: true,
    className: S.ChartTooltip,
    formatter: params => {
      const isAxisTooltip = Array.isArray(params);

      const dataIndex = isAxisTooltip ? params[0]?.dataIndex : params.dataIndex;
      const seriesId = isAxisTooltip ? null : params.seriesId;

      return renderToString(
        <ChartItemTooltip
          settings={settings}
          chartModel={chartModel}
          dataIndex={dataIndex}
          seriesId={seriesId}
          isAxisTooltip={isAxisTooltip}
        />,
      );
    },
  };
};
