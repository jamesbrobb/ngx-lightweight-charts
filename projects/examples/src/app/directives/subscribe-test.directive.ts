import {computed, Directive, inject} from "@angular/core";
import {TVChartCollectorDirective} from "ngx-lightweight-charts";
import {IChartApi, MouseEventHandler, MouseEventParams, Time} from "lightweight-charts";
import {
  BehaviorSubject,
  combineLatestWith,
  fromEventPattern,
  mergeMap,
  share,
  Subject, switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from "rxjs";


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

  readonly subscribeHandler = (handler: (event: MouseEventParams<Time>) => void) => {
    console.log('Subscribing to crosshair move');
    this.#chart.subscribeCrosshairMove(handler);
  }

  readonly unsubscribeHandler = (handler: (event: MouseEventParams<Time>) => void) => {
    console.log('Unsubscribing from crosshair move');
    this.#chart.unsubscribeCrosshairMove(handler);
  }

  readonly #destroy = new Subject();
  readonly destroy$ = this.#destroy.asObservable();

  readonly handler$ = fromEventPattern<MouseEventParams<Time> | undefined>(
    this.subscribeHandler,
    this.unsubscribeHandler
  )

  readonly crossHairPosition = new BehaviorSubject<MouseEventParams<Time> | undefined>(undefined);
  readonly crossHairPosition$ = this.crossHairPosition.asObservable().pipe(
    mergeMap(() => this.handler$),
    takeUntil(this.destroy$),
    share()
  );

  constructor(chart: IChartApi) {
    this.#chart = chart;
  }

  complete() {
    this.#destroy.next(true);
    this.#destroy.complete();
    this.crossHairPosition.complete();
  }
}
