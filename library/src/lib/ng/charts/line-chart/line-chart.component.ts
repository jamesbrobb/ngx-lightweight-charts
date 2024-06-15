import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective} from "../chart.directive";
import {LineData, LineSeriesPartialOptions, Time} from "lightweight-charts";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {tvChartInputsDirectiveHostDef, TVChartInputsDirective} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


@Component({
  selector: 'tv-line-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [
    tvChartInputsDirectiveHostDef,
    tvChartOutputsDirectiveHostDef
  ],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVLineChartDirective {
  seriesOptions = input<LineSeriesPartialOptions>({});
  data = input<LineData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
