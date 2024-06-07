import {DataChangedScope, SeriesType} from "lightweight-charts";
import {SubscriptionHandler} from "./subscription-stream-handler";
import {TVChart} from "../charts";


export class SeriesDataChangeHandler<T extends SeriesType> implements SubscriptionHandler<DataChangedScope> {

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
