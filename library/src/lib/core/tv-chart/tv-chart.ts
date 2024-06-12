import {BehaviorSubject, delay, EMPTY, filter, mergeMap, Observable, share} from "rxjs";
import {
  ChartOptions,
  DeepPartial,
  IChartApiBase,
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesMarker,
  SeriesPartialOptionsMap,
  SeriesType,
  Time, ITimeScaleApi, IPriceScaleApi, Range, LogicalRange, MouseEventParams, DataChangedScope
} from "lightweight-charts";
import {SeriesFactory, SeriesFactoryReturnType} from "../series";
import {ChartFactory, ChartSubscriptions} from "../chart";
import {TimescaleSubscriptions} from "../timescale";
import {SeriesSubscriptions} from "../series/series.types";


export class TVChart<T extends SeriesType, HorzScaleItem = Time> {

  readonly #initialised = new BehaviorSubject<undefined | TVChart<T, HorzScaleItem>>(undefined);
  readonly initialised$ = this.#initialised.asObservable().pipe(
    filter(initialised => !!initialised),
    //delay(1000 + Math.random() * 1000)
  );

  readonly #chartFactory: ChartFactory;
  readonly #seriesFactory: SeriesFactory;

  #id?: string;
  #type?: T;

  #chart?: IChartApiBase<HorzScaleItem>;
  #series?: ISeriesApi<T, HorzScaleItem>;

  #chartSubscriptions?: ChartSubscriptions<HorzScaleItem>;
  #timescaleSubscriptions?: TimescaleSubscriptions<HorzScaleItem>;
  #seriesSubscriptions?: SeriesSubscriptions;

  get id(): string | undefined {
    return this.#id;
  }

  get type(): T | undefined {
    return this.#type;
  }

  get chart(): IChartApiBase<HorzScaleItem> | undefined {
    return this.#chart;
  }

  get series(): ISeriesApi<T, HorzScaleItem> | undefined {
    return this.#series;
  }

  get options(): DeepPartial<ChartOptions> | undefined {
    return this.#chart?.options();
  }

  get timeScale(): ITimeScaleApi<HorzScaleItem> | undefined {
    return this.#chart?.timeScale();
  }

  get leftPriceScale(): IPriceScaleApi | undefined {
    return this.#chart?.priceScale('left');
  }

  get rightPriceScale(): IPriceScaleApi | undefined {
    return this.#chart?.priceScale('right');
  }

  getPriceScale(priceScaleId: 'right' | 'left' | string): IPriceScaleApi | undefined {
    return this.#chart?.priceScale(priceScaleId);
  }

  get isInitialised(): boolean {
    return !!this.#initialised.value;
  }

  get click$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.initialised$.pipe(
      mergeMap(() => this.#chartSubscriptions?.click$ || EMPTY)
    );
  }

  get dblClick$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.initialised$.pipe(
      mergeMap(() => this.#chartSubscriptions?.dblClick$ || EMPTY)
    );
  }

  get crossHairMove$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.initialised$.pipe(
      mergeMap(() => this.#chartSubscriptions?.crossHairMove$ || EMPTY)
    );
  }

  get visibleTimeRangeChange$(): Observable<Range<HorzScaleItem> | null> {
    return this.initialised$.pipe(
      mergeMap(() => this.#timescaleSubscriptions?.visibleTimeRangeChange$ || EMPTY)
    );
  }

  get visibleLogicalRangeChange$(): Observable<LogicalRange | null> {
    return this.initialised$.pipe(
      mergeMap(() => this.#timescaleSubscriptions?.visibleLogicalRangeChange$ || EMPTY)
    );
  }

  get sizeChange$(): Observable<number> {
    return this.initialised$.pipe(
      mergeMap(() => this.#timescaleSubscriptions?.sizeChange$ || EMPTY)
    );
  }

  get dataChange$(): Observable<DataChangedScope> {
    return this.initialised$.pipe(
      mergeMap(() => this.#seriesSubscriptions?.dataChange$ || EMPTY)
    );
  }

  constructor(chartFactory: ChartFactory, seriesFactory: SeriesFactory) {
    this.#chartFactory = chartFactory;
    this.#seriesFactory = seriesFactory;
  }

  initialise(
    element: HTMLElement,
    type: T,
    options: DeepPartial<ChartOptions> = {},
    seriesOptions: SeriesPartialOptionsMap[T] = {},
    id?: string
  ): void {

    if(this.isInitialised) {
      return;
    }

    this.#id = id;
    this.#type = type;
    this.#init(element, type, options, seriesOptions);

    if(!this.#chart) {
      return;
    }

    this.#initialised.next(this);
  }

  applyOptions(options?: DeepPartial<ChartOptions>) {
    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }
    this.#chart?.applyOptions(options || {});
  }

  applySeriesOptions(seriesOptions?: SeriesPartialOptionsMap[T]) {
    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }
    this.#series?.applyOptions(seriesOptions || {});
  }

  setData(data: SeriesDataItemTypeMap<HorzScaleItem>[T][]): void {
    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }
    this.#series?.setData(data);
  }

  setMarkers(markers: SeriesMarker<HorzScaleItem>[]): void {
    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }
    this.#series?.setMarkers(markers);
  }

  setVisibleLogicalRange(range: Range<number>): void {
    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }
    this.#chart?.timeScale().setVisibleLogicalRange(range);
  }

  addAdditionalSeries<ST extends SeriesType>(
    type: ST,
    seriesOptions: SeriesPartialOptionsMap[ST]
  ): SeriesFactoryReturnType<ST, HorzScaleItem>  {

    if(!this.isInitialised) {
      this.#uninitialisedWarning();
    }

    return this.#seriesFactory.create<ST, HorzScaleItem>(type, this.#chart!, seriesOptions);
  }

  removeSeries(series?: ISeriesApi<SeriesType, HorzScaleItem>): void {
    if(!series) {
      series = this.#series;
    }

    if(!series) {
      return;
    }

    this.#chart?.removeSeries(series);
  }

  resize(width: number, height: number, forceRepaint?: boolean): void {
    this.#chart?.resize(width, height, forceRepaint);
  }

  remove() {
    this.#chart?.remove();
    this.#chartSubscriptions?.destroy();
    this.#timescaleSubscriptions?.destroy();
    this.#seriesSubscriptions?.destroy();
  }

  #init(element: HTMLElement, type: T, options: DeepPartial<ChartOptions>, seriesOptions: SeriesPartialOptionsMap[T]) {
    ({
      chart: this.#chart,
      chartSubscriptions: this.#chartSubscriptions,
      timescaleSubscriptions: this.#timescaleSubscriptions
    } = this.#chartFactory.create<HorzScaleItem>(element, options));

    ({
      series: this.#series,
      seriesSubscriptions: this.#seriesSubscriptions
    } = this.#seriesFactory.create<T, HorzScaleItem>(type, this.#chart, seriesOptions));
  }

  #uninitialisedWarning() {
    console.warn('Chart not initialised');
  }
}
