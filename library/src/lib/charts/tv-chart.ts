import {
  createChart,
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
import {BehaviorSubject} from "rxjs";


export type SeriesCreationFn<T extends SeriesType, HorzScaleItem> = (options: SeriesPartialOptionsMap[T]) => ISeriesApi<T, HorzScaleItem>;


export class TVChart<T extends SeriesType, HorzScaleItem = Time> {

  readonly #initialised = new BehaviorSubject<boolean>(false);
  readonly initialised$ = this.#initialised.asObservable();

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

    if(!this.chart) {
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

  createAdditionalSeries<ST extends SeriesType, HSI = Time>(
    type: ST,
    seriesOptions: SeriesPartialOptionsMap[ST]
  ): ISeriesApi<ST, HSI> | undefined {

    if(!this.isInitialised) {
      this.#uninitialisedWarning();
      return;
    }

    return this.#createSeries(type, this.#chart!, seriesOptions);
  }

  remove() {
    this.#chart?.remove();
  }

  #init(element: HTMLElement, type: T, options: DeepPartial<ChartOptions>, seriesOptions: SeriesPartialOptionsMap[T]) {

    this.#chart = createChart(element, options);
    this.#series = this.#createSeries(type, this.#chart, seriesOptions);
  }

  #createSeries<ST extends SeriesType, HSI = Time>(
    type: ST,
    chart: IChartApi,
    seriesOptions: SeriesPartialOptionsMap[ST]
  ): ISeriesApi<ST, HSI> | undefined {

    const fn: SeriesCreationFn<ST, HSI> | undefined = this.#getSeriesCreationFn(type, chart);

    if(!fn) {
      return;
    }

    return fn.call(this.#chart, seriesOptions);
  }

  #getSeriesCreationFn<ST extends SeriesType, HSI = Time>(type: ST, chart: IChartApi): SeriesCreationFn<ST, HSI> | undefined {

    let fn: any | undefined;

    switch(type) {
      case 'Candlestick':
        fn = chart.addCandlestickSeries;
        break;
      case 'Histogram':
        fn = chart.addHistogramSeries;
        break;
      case 'Line':
        fn = chart.addLineSeries;
        break;
      case 'Area':
        fn = chart.addAreaSeries;
        break;
      case 'Bar':
        fn = chart.addBarSeries;
        break;
      case 'Baseline':
        fn = chart.addBaselineSeries;
        break;
      case 'Custom':
        fn = chart.addCustomSeries;
        break;
    }

    return fn as SeriesCreationFn<ST, HSI> | undefined;
  }

  #uninitialisedWarning() {
    console.warn('Chart not initialised');
  }
}
