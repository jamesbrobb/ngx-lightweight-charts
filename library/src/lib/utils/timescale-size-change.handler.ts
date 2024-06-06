import {SeriesType} from "lightweight-charts";
import {Handler} from "./subscription-handler";
import {TVChart} from "../charts";


export class TimescaleSizeChangeHandler<T extends SeriesType> implements Handler<number> {

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
