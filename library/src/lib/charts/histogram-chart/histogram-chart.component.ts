import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {TVChart} from "../tv-chart";
import {HistogramData, HistogramSeriesPartialOptions, Time} from "lightweight-charts";
import {tvChartProvider} from "../tv-chart.provider";


const DEFAULT_HISTOGRAM_SERIES_OPTIONS: HistogramSeriesPartialOptions = {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  }
}


@Component({
  selector: 'tv-histogram-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './histogram-chart.component.html',
  styleUrl: './histogram-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVHistogramChartComponent {
  seriesOptions = input<HistogramSeriesPartialOptions>(DEFAULT_HISTOGRAM_SERIES_OPTIONS);
  data = input<HistogramData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
