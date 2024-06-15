import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {ChartFactory, SeriesFactory} from "../core";


export function getTVChartDefaultProviders(): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: ChartFactory,
    useFactory: () => new ChartFactory()
  }, {
    provide: SeriesFactory,
    useFactory: () => new SeriesFactory()
  }]);
}
