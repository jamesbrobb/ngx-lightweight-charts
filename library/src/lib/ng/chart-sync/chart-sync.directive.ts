import {Directive, effect, inject} from '@angular/core';
import {TVChartsCollectorDirective} from "../charts-collector/charts-collector.directive";
import {SyncService} from "../../core";


@Directive({
  selector: '[tvChartSync]',
  standalone: true,
  providers: [{
    provide: SyncService,
    useFactory: () => {
      return new SyncService();
    }
  }]
})
export class TVChartSyncDirective {

  readonly #collector = inject(TVChartsCollectorDirective);
  readonly #syncService = inject(SyncService);

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();

      if (!charts) {
        return;
      }

      /*
        need to manage register/deregister at this level
       */
      charts.forEach(chart => {
        this.#syncService.register(chart);
      });
    });
  }

}
