import {BehaviorSubject} from "rxjs";
import {
  ChartOptions,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesMarker,
  SeriesPartialOptionsMap,
  SeriesType,
  Time, ITimeScaleApi, IPriceScaleApi
} from "lightweight-charts";
import {SeriesFactory, SeriesFactoryReturnType} from "../series";
import {ChartFactory} from "../chart";


export class TVChart<T extends SeriesType, HorzScaleItem = Time> {

  readonly #initialised = new BehaviorSubject<boolean>(false);
  readonly initialised$ = this.#initialised.asObservable();

  readonly #chartFactory: ChartFactory;
  readonly #seriesFactory: SeriesFactory;

  #id?: string;
  #type?: T;

  #chart?: IChartApi;
  #series?: ISeriesApi<T, HorzScaleItem>;

  get id(): string | undefined {
    return this.#id;
  }

  get type(): T | undefined {
    return this.#type;
  }

  get chart(): IChartApi | undefined {
    return this.#chart;
  }

  get series(): ISeriesApi<T, HorzScaleItem> | undefined {
    return this.#series;
  }

  get options(): DeepPartial<ChartOptions> | undefined {
    return this.#chart?.options();
  }

  get timeScale(): ITimeScaleApi<Time> | undefined {
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
    return this.#initialised.value;
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

    if(this.#chart) {
      return;
    }

    this.#id = id;
    this.#type = type;
    this.#init(element, type, options, seriesOptions);

    if(!this.#chart) {
      return;
    }

    this.#initialised.next(true);
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

  addAdditionalSeries<ST extends SeriesType, HSI = Time>(
    type: ST,
    seriesOptions: SeriesPartialOptionsMap[ST]
  ): SeriesFactoryReturnType<ST, HSI>  {

    if(!this.isInitialised) {
      this.#uninitialisedWarning();
    }

    return this.#seriesFactory.create<ST, HSI>(type, this.#chart!, seriesOptions);
  }

  removeSeries(series?: ISeriesApi<SeriesType, HorzScaleItem>): void {
    if(!series) {
      series = this.#series;
    }

    if(!series) {
      return;
    }
    // TODO: Fix typing issue
    this.#chart?.removeSeries(series as any);
  }

  resize(width: number, height: number, forceRepaint?: boolean): void {
    this.#chart?.resize(width, height, forceRepaint);
  }

  remove() {
    this.#chart?.remove();
  }

  #init(element: HTMLElement, type: T, options: DeepPartial<ChartOptions>, seriesOptions: SeriesPartialOptionsMap[T]) {
    ({chart: this.#chart} = this.#chartFactory.create(element, options));
    ({series: this.#series} = this.#seriesFactory.create<T, HorzScaleItem>(type, this.#chart, seriesOptions));
  }

  #uninitialisedWarning() {
    console.warn('Chart not initialised');
  }
}
