import {ChartOptions, createChart, DeepPartial, IChartApi} from "lightweight-charts";


export type ChartFactoryReturnType = {
  chart: IChartApi
};


export class ChartFactory {

  create(element: HTMLElement, options: DeepPartial<ChartOptions>): ChartFactoryReturnType {
    const chart = createChart(element, options);

    return {
      chart
    }
  }
}
