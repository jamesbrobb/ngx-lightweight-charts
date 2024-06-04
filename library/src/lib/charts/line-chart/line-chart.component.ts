import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {LineData, LineSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChart} from "../tv-chart";


@Component({
  selector: 'tv-line-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [TVChart],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVLineChartDirective {
  seriesOptions = input<LineSeriesPartialOptions>({});
  points = input<LineData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
