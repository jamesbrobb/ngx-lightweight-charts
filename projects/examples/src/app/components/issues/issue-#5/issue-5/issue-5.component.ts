import {Component, input, signal} from '@angular/core';
import {NgFor} from "@angular/common";
import {ChartOptions, DeepPartial, LineData, OhlcData, Time} from "lightweight-charts";
import {
  TVChart,
  TVChartDirective,
  TVCandleStickChartComponent,
  TVChartCollectorDirective,
  TVChartSyncDirective,
} from "ngx-lightweight-charts";


@Component({
  selector: 'app-issue-5',
  standalone: true,
  imports: [
    NgFor,
    TVChartDirective,
    TVCandleStickChartComponent,
    TVChartCollectorDirective,
    TVChartSyncDirective,
  ],
  templateUrl: './issue-5.component.html',
  styleUrl: './issue-5.component.scss'
})
export class Issue5Component {

  data = input<OhlcData<Time>[]>([] as OhlcData<Time>[]);
  indiData = input<LineData<Time>[]>([] as LineData<Time>[]);
  options: DeepPartial<ChartOptions> = {
    height: 200,
    rightPriceScale: {
      minimumWidth: 80
    }
  }

  getIndicatorCharts = signal<{
    id: string
  }[]>([] as any);

  onMainChartInit(chart?: TVChart<any, any>) {
    console.log('Main chart init', chart);
  }

  onIndicatorChartInit(chart?: TVChart<any, any>, id?: string) {
    console.log('Indicator chart init', chart, id);
  }

  addChart() {
    const charts = this.getIndicatorCharts();
    const id = `indicator-${charts.length + 1}`;
    this.getIndicatorCharts.set([...charts, {id}]);
  }

  removeChart() {
    const charts = this.getIndicatorCharts();
    if(charts.length) {
      this.getIndicatorCharts.set(charts.slice(0, -1));
    }
  }
}
