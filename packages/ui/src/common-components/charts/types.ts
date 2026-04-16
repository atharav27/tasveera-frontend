export interface BaseChartProps {
  title: string;
  description?: string;
  showDownloadButton?: boolean;
  className?: string;
}

export interface AxisConfig {
  dataKey?: string;
  domain?: [number, number] | [string, string];
  ticks?: number[];
  tickFormatter?: (value: number | string) => string;
  label?: string;
  type?: "number" | "category";
  width?: number;
}

export interface BarChartProps extends BaseChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKeys: string[];
  xAxisConfig?: AxisConfig;
  yAxisConfig?: AxisConfig;
  layout?: "horizontal" | "vertical";
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  useCellColors?: boolean;
}

export interface PieChartProps extends BaseChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  nameKey: string;
  showLegend?: boolean;
  labelFormatter?: (entry: unknown) => string;
  outerRadius?: number;
  cx?: string;
  cy?: string;
}
