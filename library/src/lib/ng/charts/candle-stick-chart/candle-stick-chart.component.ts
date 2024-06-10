import {Component, effect, inject, input, viewChild} from '@angular/core';
import {
  CandlestickData,
  CandlestickSeriesPartialOptions,
  HistogramData,
  HistogramSeriesPartialOptions,
  ISeriesApi,
  Time
} from "lightweight-charts";

import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChart} from "../../../core/tv-chart/tv-chart";


const DEFAULT_DARK_SERIES_OPTIONS: CandlestickSeriesPartialOptions = {
  wickUpColor: 'rgb(54, 116, 217)',
  upColor: 'rgb(54, 116, 217)',
  wickDownColor: 'rgb(225, 50, 85)',
  downColor: 'rgb(225, 50, 85)',
  borderVisible: false,
}


const DEFAULT_HISTOGRAM_SERIES_OPTIONS: HistogramSeriesPartialOptions = {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: ''
}


@Component({
  selector: 'tv-candlestick-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './candlestick-chart.component.html',
  styleUrl: './candlestick-chart.component.scss'
})
export class TVCandleStickChartComponent {

  seriesOptions = input<CandlestickSeriesPartialOptions>({});
  volumeOptions = input<HistogramSeriesPartialOptions>(DEFAULT_HISTOGRAM_SERIES_OPTIONS);

  klines = input<CandlestickData[]>();
  volume = input<HistogramData[]>();

  chart = viewChild<TVChartDirective<'Candlestick'>, TVChart<'Candlestick'>>(
    TVChartDirective,
    {read: TVChart}
  );

  readonly inputs = inject(TVChartInputsDirective);

  #histogramSeries?: ISeriesApi<'Histogram'>;

  constructor() {

    effect(() => {
      const data = this.volume(),
        chart = this.chart()?.chart;

      if(!data || !chart) {
        return;
      }
      this.#setVolume(data);
    });
  }

  #setVolume(data: HistogramData[]): void {
    if(!this.#histogramSeries) {
      this.#initialiseHistogram();
    }
    this.#histogramSeries!.setData(data);
  }

  #initialiseHistogram(): void {

    const chart = this.chart();

    if(!chart) {
      console.warn('TVCandleStickChartComponent::initialiseHistogram - Chart not initialised')
      return;
    }

    ({series: this.#histogramSeries} = chart.addAdditionalSeries<'Histogram', Time>('Histogram', this.volumeOptions()));

    if(!this.#histogramSeries) {
      return;
    }

    this.#histogramSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });
  }
}
