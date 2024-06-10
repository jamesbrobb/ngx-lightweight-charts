import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {ChartFactory, SeriesFactory} from "../core";


export function getTVChartProviders(): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: ChartFactory,
    useFactory: () => {
      return new ChartFactory();
    }
  }, {
    provide: SeriesFactory,
    useFactory: () => {
      return new SeriesFactory();
    }
  }]);
}
