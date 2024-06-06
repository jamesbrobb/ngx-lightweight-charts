import {DataChangedScope, SeriesType} from "lightweight-charts";
import {Handler} from "./subscription-handler";
import {TVChart} from "../charts";


export class SeriesDataChangeHandler<T extends SeriesType> implements Handler<DataChangedScope> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (scope: DataChangedScope) => void): void {
    this.#chart.series?.subscribeDataChanged(handler);
  }

  unsubscribe(handler: (scope: DataChangedScope) => void): void {
    this.#chart.series?.unsubscribeDataChanged(handler);
  }
}
