import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BarData, BarSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


const DEFAULT_BAR_SERIES_OPTIONS: BarSeriesPartialOptions = {
  priceFormat: {
    type: 'volume',
  }
}


@Component({
    selector: 'tv-bar-chart',
    imports: [TVChartDirective],
    providers: [tvChartProvider],
    hostDirectives: [
        tvChartInputsDirectiveHostDef,
        tvChartOutputsDirectiveHostDef
    ],
    templateUrl: './bar-chart.component.html',
    styleUrl: './bar-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVBarChartDirective {
  seriesOptions = input<BarSeriesPartialOptions>(DEFAULT_BAR_SERIES_OPTIONS);
  data = input<BarData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
