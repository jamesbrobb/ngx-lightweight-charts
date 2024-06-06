import {computed, Directive, inject} from "@angular/core";
import {TVChartCollectorDirective} from "ngx-lightweight-charts";
import {IChartApi, MouseEventHandler, MouseEventParams, Time} from "lightweight-charts";
import {share, Subject, tap} from "rxjs";


@Directive({
  selector: '[subscribeTest]',
  standalone: true,
  hostDirectives: [
    TVChartCollectorDirective
  ]
})
export class SubscribeTestDirective {

  readonly #collector = inject(TVChartCollectorDirective);
  readonly subscriber = computed(() => {
    const chart = this.#collector.chart();
    if(!chart || !chart.chart) {
      return;
    }
    return new ChartSubscriber(chart.chart);
  });
}

export class ChartSubscriber {

  readonly #chart: IChartApi;

  readonly #crossHairPosition = new Subject();
  readonly crossHairPosition$ = this.#crossHairPosition.asObservable().pipe(
    tap({
      subscribe: () => {
        console.log('Subscribed to crosshair position events');
        this.subscribeHandler();
      },
      unsubscribe: () => {
        console.log('Unsubscribed to crosshair position events');
        this.unsubscribeHandler();
      },
      finalize: () => {
        console.log('finalized to crosshair position events')
        this.unsubscribeHandler();
      }
    }),
    share()
  );

  constructor(chart: IChartApi) {
    this.#chart = chart;
  }

  subscribeHandler() {
    this.#chart.subscribeCrosshairMove(this.#crosshairHandler);
  }

  unsubscribeHandler() {
    this.#chart.unsubscribeCrosshairMove(this.#crosshairHandler);
  }

  complete() {
    this.#crossHairPosition.complete();
  }

  readonly #crosshairHandler: MouseEventHandler<Time> = (event: MouseEventParams<Time>) => {
    this.#crossHairPosition.next(event);
  }
}
