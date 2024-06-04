import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {BaselineData, BaselineSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {TVChart} from "../tv-chart";


@Component({
  selector: 'tv-baseline-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [TVChart],
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
