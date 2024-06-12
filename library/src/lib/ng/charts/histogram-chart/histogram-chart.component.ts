import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {HistogramData, HistogramSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {tvChartInputsDirectiveHostDef, TVChartInputsDirective} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


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
  hostDirectives: [
    tvChartInputsDirectiveHostDef,
    tvChartOutputsDirectiveHostDef
  ],
  templateUrl: './histogram-chart.component.html',
  styleUrl: './histogram-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVHistogramChartComponent {
  seriesOptions = input<HistogramSeriesPartialOptions>(DEFAULT_HISTOGRAM_SERIES_OPTIONS);
  data = input<HistogramData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
