import {BehaviorSubject, delay, EMPTY, filter, mergeMap, Observable} from "rxjs";
import {
  ChartOptions,
  DeepPartial,
  IChartApiBase,
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesMarker,
  SeriesPartialOptionsMap,
  SeriesType,
  Time, ITimeScaleApi, IPriceScaleApi, Range, LogicalRange, MouseEventParams, DataChangedScope, Point
} from "lightweight-charts";
import {SeriesFactory, SeriesFactoryReturnType} from "../series";
import {ChartFactory, ChartSubscriptions} from "../chart";
import {TimescaleSubscriptions} from "../timescale";
import {SeriesSubscriptions} from "../series/series.types";



export function unInitialisedWarning<TThis extends TVChart<any>, Fn extends (...args: any[]) => any>(
  originalMethod: Fn,
  context: ClassMethodDecoratorContext<ThisParameterType<Fn>, Fn>
) {
  if (context.kind === "method") {
    return function(this: TThis, ...args: any[]) {
      if(!this.isInitialised) {
        console.group('Chart not initialised')
        console.warn(`Call to ${String(context.name)} ignored`);
        console.warn('Arguments', args);
        console.warn('Chart', this);
        console.groupEnd();
        return;
      }
      return originalMethod.apply(this, args)
    }
  }
  return originalMethod;
}



export class TVChart<T extends SeriesType, HorzScaleItem = Time> {

  readonly #chartFactory: ChartFactory;
  readonly #seriesFactory: SeriesFactory;

  #id?: string;
  #type?: T;

  #chart?: IChartApiBase<HorzScaleItem>;
  #series?: ISeriesApi<T, HorzScaleItem>;

  #chartSubscriptions?: ChartSubscriptions<HorzScaleItem>;
  #timescaleSubscriptions?: TimescaleSubscriptions<HorzScaleItem>;
  #seriesSubscriptions?: SeriesSubscriptions;


  readonly #initialised = new BehaviorSubject<undefined | TVChart<T, HorzScaleItem>>(undefined);
  readonly initialised$: Observable<TVChart<T, HorzScaleItem> | undefined> = this.#initialised.asObservable().pipe(
    filter(initialised => !!initialised),
    //delay(1000 + Math.random() * 1000)
  );

  readonly click$: Observable<MouseEventParams<HorzScaleItem>> = this.initialised$.pipe(
    mergeMap(() => this.#chartSubscriptions?.click$ || EMPTY)
  );

  readonly dblClick$: Observable<MouseEventParams<HorzScaleItem>> = this.initialised$.pipe(
    mergeMap(() => this.#chartSubscriptions?.dblClick$ || EMPTY)
  );

  readonly crossHairMove$: Observable<MouseEventParams<HorzScaleItem>> = this.initialised$.pipe(
    mergeMap(() => this.#chartSubscriptions?.crossHairMove$ || EMPTY)
  );

  readonly visibleTimeRangeChange$: Observable<Range<HorzScaleItem> | null> = this.initialised$.pipe(
    mergeMap(() => this.#timescaleSubscriptions?.visibleTimeRangeChange$ || EMPTY)
  );

  readonly visibleLogicalRangeChange$: Observable<LogicalRange | null> = this.initialised$.pipe(
    mergeMap(() => this.#timescaleSubscriptions?.visibleLogicalRangeChange$ || EMPTY)
  );

  readonly sizeChange$: Observable<number> = this.initialised$.pipe(
    mergeMap(() => this.#timescaleSubscriptions?.sizeChange$ || EMPTY)
  );

  readonly dataChange$: Observable<DataChangedScope> = this.initialised$.pipe(
    mergeMap(() => this.#seriesSubscriptions?.dataChange$ || EMPTY)
  );


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

  @unInitialisedWarning
  applyOptions(options?: DeepPartial<ChartOptions>) {
    this.#chart?.applyOptions(options || {});
  }

  @unInitialisedWarning
  applySeriesOptions(seriesOptions?: SeriesPartialOptionsMap[T]) {
    this.#series?.applyOptions(seriesOptions || {});
  }

  @unInitialisedWarning
  setData(data: SeriesDataItemTypeMap<HorzScaleItem>[T][]): void {
    this.#series?.setData(data);
  }

  @unInitialisedWarning
  setMarkers(markers: SeriesMarker<HorzScaleItem>[]): void {
    this.#series?.setMarkers(markers);
  }

  @unInitialisedWarning
  setVisibleLogicalRange(range: Range<number>): void {
    this.#chart?.timeScale().setVisibleLogicalRange(range);
  }

  @unInitialisedWarning
  setVisibleRange(range: Range<HorzScaleItem>): void {
    this.#chart?.timeScale().setVisibleRange(range);
  }

  @unInitialisedWarning
  setCrosshairPosition(price: number, horizontalPosition: HorzScaleItem, seriesApi: ISeriesApi<SeriesType, HorzScaleItem>): void {
    this.#chart?.setCrosshairPosition(price, horizontalPosition, seriesApi);
  }

  @unInitialisedWarning
  setCrossHairPositionByPoint(point: Point, time?: HorzScaleItem): void {

    const xValue = time || this.#chart?.timeScale().coordinateToTime(point.x),
      yValue = this.#series?.coordinateToPrice(point.y);

    if(!xValue || !yValue) {
      return;
    }

    this.setCrosshairPosition(yValue, xValue, this.#series!);
  }

  @unInitialisedWarning
  clearCrosshairPosition(): void {
    this.#chart?.clearCrosshairPosition();
  }

  @unInitialisedWarning
  addAdditionalSeries<ST extends SeriesType>(
    type: ST,
    seriesOptions: SeriesPartialOptionsMap[ST]
  ): SeriesFactoryReturnType<ST, HorzScaleItem> {

    if(!this.#chart) {
      return {
        series: undefined,
        seriesSubscriptions: undefined
      };
    }

    return this.#seriesFactory.create<ST, HorzScaleItem>(type, this.#chart, seriesOptions);
  }

  @unInitialisedWarning
  removeSeries(series?: ISeriesApi<SeriesType, HorzScaleItem>): void {
    if(!series) {
      series = this.#series;
    }

    if(!series) {
      return;
    }

    this.#chart?.removeSeries(series);
  }

  @unInitialisedWarning
  resize(width: number, height: number, forceRepaint?: boolean): void {
    this.#chart?.resize(width, height, forceRepaint);
  }

  @unInitialisedWarning
  remove() {
    this.#chart?.remove();
    this.#chartSubscriptions?.destroy();
    this.#timescaleSubscriptions?.destroy();
    this.#seriesSubscriptions?.destroy();
    this.#initialised.complete();
  }

  #init(
    element: HTMLElement,
    type: T,
    options: DeepPartial<ChartOptions>,
    seriesOptions: SeriesPartialOptionsMap[T]
  ): void {
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
}
