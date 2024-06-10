import deepmerge from "deepmerge";
import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  effect, OnInit
} from '@angular/core';

import {
  ChartOptions, ColorType,
  DeepPartial, LineStyle,
  SeriesDataItemTypeMap,
  SeriesMarker,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from "lightweight-charts";
import {TVChart} from "../../core";
import {tvChartExistenceCheckProvider} from "../providers/tv-chart.provider";


export const DEFAULT_CHART_OPTIONS: DeepPartial<ChartOptions> = {
  height: 300,
  autoSize: true,
  timeScale: {
    fixRightEdge: true,
    lockVisibleTimeRangeOnResize: true,
    timeVisible: true,
    secondsVisible: false,
  },
  crosshair: {
    vertLine: {
      style: LineStyle.LargeDashed
    },
    horzLine: {
      style: LineStyle.LargeDashed
    },
  }
}


const DEFAULT_DARK_CHART_OPTIONS: DeepPartial<ChartOptions> = deepmerge(
  DEFAULT_CHART_OPTIONS, {
  layout: {
    background: { type: ColorType.Solid, color: '#222' },
    textColor: '#DDD',
  },
  grid: {
    vertLines: { color: '#444' },
    horzLines: { color: '#444' },
  },
  timeScale: {
    borderColor: '#555',
  },
  leftPriceScale: {
    borderColor: '#555'
  },
  rightPriceScale: {
    borderColor: '#555'
  },
  crosshair: {
    vertLine: {
      color: '#fff',
      labelBackgroundColor: '#aaa',
      style: LineStyle.SparseDotted
    },
    horzLine: {
      color: '#fff',
      labelBackgroundColor: '#aaa',
      style: LineStyle.SparseDotted
    },
  }
});


@Directive({
  selector: '[tvChartInputs]',
  standalone: true,
})
export class TVChartInputsDirective<HorzScaleItem = Time> {
  id = input<string>();
  options = input<DeepPartial<ChartOptions>>();
  markers = input<SeriesMarker<HorzScaleItem>[]>();
}


@Directive({
  selector: '[tvChart]',
  standalone: true,
  providers: [tvChartExistenceCheckProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }]
})
export class TVChartDirective<T extends SeriesType, HorzScaleItem = Time> implements OnInit, OnDestroy {

  type = input.required<T>({alias: 'tvChart'});
  seriesOptions = input.required<SeriesPartialOptionsMap[T]>();
  data = input<SeriesDataItemTypeMap<HorzScaleItem>[T][]>();

  readonly #inputs = inject(TVChartInputsDirective);
  readonly #element = inject(ElementRef<HTMLElement>).nativeElement;
  readonly #chart = inject(TVChart<T, HorzScaleItem>);

  constructor() {

    effect(() => {
      this.#chart.applyOptions(this.#inputs.options());
    });

    effect(() => {
      this.#chart.applySeriesOptions(this.seriesOptions());
    });

    effect(() => {
      this.#chart.setData(this.data() || []);
    });

    effect(() => {
      this.#chart.setMarkers(this.#inputs.markers() || []);
    });
  }

  ngOnInit() {
    const options = deepmerge(DEFAULT_CHART_OPTIONS, this.#inputs.options() || {});
    this.#chart.initialise(this.#element, this.type(), options, this.seriesOptions() || {}, this.#inputs.id());
  }

  ngOnDestroy() {
    this.#chart.remove();
  }
}
