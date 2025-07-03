export interface ChartDataType {
  chartType: "bar" | "line" | "pie";
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
  }[];
}
