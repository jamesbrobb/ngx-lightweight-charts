import {ChartOptions, createChart, DeepPartial, IChartApi} from "lightweight-charts";
import {ChartSubscriptions} from "./chart.types";
import {ChartStreams} from "./chart-streams";
import {TimescaleStreams, TimescaleSubscriptions} from "../timescale";


export type ChartFactoryReturnType = {
  chart: IChartApi,
  chartSubscriptions: ChartSubscriptions,
  timescaleSubscriptions: TimescaleSubscriptions
};


export class ChartFactory {

  create(element: HTMLElement, options: DeepPartial<ChartOptions>): ChartFactoryReturnType {
    const chart = createChart(element, options),
      chartSubscriptions = new ChartStreams(chart),
      timescaleSubscriptions = new TimescaleStreams(chart.timeScale());

    return {
      chart,
      chartSubscriptions,
      timescaleSubscriptions
    }
  }
}
