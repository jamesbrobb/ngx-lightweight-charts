import {SubscriptionStreamHandler} from "./subscription-stream-handler";


export class ChartStreams {
  readonly #crossHairMove: SubscriptionStreamHandler<MouseEventParams<Time>>;
  readonly #click: SubscriptionStreamHandler<MouseEventParams<Time>>;
  readonly #dblClick: SubscriptionStreamHandler<MouseEventParams<Time>>;

  constructor() {
  }
}
