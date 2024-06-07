import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BarData, BarSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {tvChartProvider} from "../tv-chart.provider";


const DEFAULT_BAR_SERIES_OPTIONS: BarSeriesPartialOptions = {
  priceFormat: {
    type: 'volume',
  }
}


@Component({
  selector: 'tv-bar-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVBarChartDirective {
  seriesOptions = input<BarSeriesPartialOptions>(DEFAULT_BAR_SERIES_OPTIONS);
  bars = input<BarData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
