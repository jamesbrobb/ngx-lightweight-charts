import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BaselineData, BaselineSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {tvChartProvider} from "../tv-chart.provider";


@Component({
  selector: 'tv-baseline-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './baseline-chart.component.html',
  styleUrl: './baseline-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVBaselineChartComponent {
  seriesOptions = input<BaselineSeriesPartialOptions>({});
  points = input<BaselineData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
