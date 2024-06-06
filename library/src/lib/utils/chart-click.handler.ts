import {MouseEventParams, SeriesType, Time} from "lightweight-charts";
import {Handler} from "./subscription-handler";
import {TVChart} from "../charts";


export class ChartClickHandler<T extends SeriesType> implements Handler<MouseEventParams<Time>> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.subscribeClick(handler);
  }

  unsubscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.unsubscribeClick(handler);
  }
}
