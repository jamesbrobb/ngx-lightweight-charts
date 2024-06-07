import {Directive, effect, inject, input} from "@angular/core";
import {SubscribeTestDirective} from "./subscribe-test.directive";
import {Subscription} from "rxjs";


@Directive({
  selector: '[crosshairSubscribe]',
  standalone: true
})
export class CrosshairSubscribeDirective {

  subscriptionCount = input<number>(0);
  completed = input<boolean>(false);

  sub = inject(SubscribeTestDirective);

  subscriptions: Subscription[] = [];

  constructor() {
    effect(() => {
      if(this.completed()) {
        const subscriber = this.sub.subscriber();
        if(!subscriber) {
          return;
        }
        subscriber.complete();
      }
    });
    effect(() => {
      const subscriber = this.sub.subscriber();
      if(!subscriber) {
        return;
      }
      const count = this.subscriptionCount();
      if(count > this.subscriptions.length) {

        this.subscriptions.push(subscriber.crossHairPosition$.subscribe({
          next: (position) => {
            console.log('Crosshair position', position);
          },
          complete: () => {
            console.log('Crosshair subscription complete');
          }
        }));
      }

      if(count < this.subscriptions.length) {
        this.subscriptions.pop()?.unsubscribe();
      }
    });
  }
}
