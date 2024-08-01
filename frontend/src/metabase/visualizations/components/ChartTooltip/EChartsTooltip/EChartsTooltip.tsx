import cx from "classnames";
import type React from "react";

import CS from "metabase/css/core/index.css";

import TooltipStyles from "./EChartsTooltip.module.css";

interface Header {
  indicatorClass?: string;
  text: string;
}

interface Row {
  indicatorClass?: string;
  name: string;
  values: React.ReactNode[];
}

export interface EChartsTooltipProps {
  header?: Header;
  rows: Row[];
  footerRows?: Row[];
}

export const EChartsTooltip = ({
  header,
  rows,
  footerRows,
}: EChartsTooltipProps) => {
  const hasHeader = header != null;
  const hasFooter = footerRows != null && footerRows.length > 0;

  return (
    <div>
      {hasHeader && (
        <div className={TooltipStyles.Header}>
          {header.indicatorClass != null ? (
            <span
              className={cx(TooltipStyles.Indicator, header.indicatorClass)}
            />
          ) : null}
          <span>{header.text}</span>
        </div>
      )}
      <table className={TooltipStyles.Table}>
        <tbody>
          {rows.map(({ name, values }, index) => (
            <TooltipRow key={index} name={name} values={values} />
          ))}
        </tbody>
        {hasFooter && (
          <tfoot>
            {footerRows.map(({ name, values }, index) => (
              <TooltipRow key={index} name={name} values={values} />
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export type TooltipRowProps = Row;

const TooltipRow = ({ name, values, indicatorClass }: TooltipRowProps) => (
  <tr>
    {name ? (
      <td className={cx(TooltipStyles.Cell, CS.textLight, CS.textLeft)}>
        {name}:
      </td>
    ) : (
      <td className={TooltipStyles.Cell} />
    )}
    {values.map((value, i) => (
      <td key={i} className={cx(TooltipStyles.Cell, CS.textBold, CS.textRight)}>
        {value}
      </td>
    ))}
  </tr>
);
