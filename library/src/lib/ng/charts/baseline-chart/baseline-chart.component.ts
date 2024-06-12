import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BaselineData, BaselineSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


@Component({
  selector: 'tv-baseline-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [
    tvChartInputsDirectiveHostDef,
    tvChartOutputsDirectiveHostDef
  ],
  templateUrl: './baseline-chart.component.html',
  styleUrl: './baseline-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVBaselineChartComponent {
  seriesOptions = input<BaselineSeriesPartialOptions>({});
  points = input<BaselineData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
