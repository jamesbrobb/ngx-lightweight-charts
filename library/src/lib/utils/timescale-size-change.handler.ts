import {SeriesType} from "lightweight-charts";
import {SubscriptionHandler} from "./subscription-stream-handler";
import {TVChart} from "../charts";


export class TimescaleSizeChangeHandler<T extends SeriesType> implements SubscriptionHandler<number> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: number) => void): void {
    this.#chart.timeScale?.subscribeSizeChange(handler);
  }

  unsubscribe(handler: (arg: number) => void): void {
    this.#chart.timeScale?.unsubscribeSizeChange(handler);
  }
}
