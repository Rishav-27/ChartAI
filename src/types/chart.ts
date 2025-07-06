export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "radar"
  | "polararea";

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  [key: string]: string | number | string[] | number[] | undefined; 
}

export interface ChartDataType {
  chartType: ChartType;
  labels: string[];
  datasets: ChartDataset[];
  title?: string;
}
