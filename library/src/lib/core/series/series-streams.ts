import {Observable} from "rxjs";
import {DataChangedScope, ISeriesApi, SeriesType, Time} from "lightweight-charts";
import {SeriesSubscriptions} from "./series.types";
import {SubscriptionStreamHandler} from "../subscriptions";


export class SeriesStreams<T extends SeriesType, HorzScaleItem = Time> implements SeriesSubscriptions {
  readonly #dataChange: SubscriptionStreamHandler<DataChangedScope>;

  get dataChange$(): Observable<DataChangedScope> {
    return this.#dataChange.stream$;
  }

  constructor(series: ISeriesApi<T, HorzScaleItem>) {
    this.#dataChange = new SubscriptionStreamHandler(
      series.subscribeDataChanged.bind(series),
      series.unsubscribeDataChanged.bind(series)
    );
  }

  destroy(): void {
    this.#dataChange.destroy();
  }
}
