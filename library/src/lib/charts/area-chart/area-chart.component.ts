import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {TVChart} from "../tv-chart";
import {AreaData, AreaSeriesPartialOptions, Time} from "lightweight-charts";


@Component({
  selector: 'tv-area-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [TVChart],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVAreaChartComponent {
  seriesOptions = input<AreaSeriesPartialOptions>({});
  points = input<AreaData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
