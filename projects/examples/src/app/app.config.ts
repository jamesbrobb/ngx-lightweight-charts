import { ApplicationConfig } from '@angular/core';
import {tableDataProviders} from "./loader/arrow_loader";
import {getTVChartDefaultProviders} from "ngx-lightweight-charts";


export const appConfig: ApplicationConfig = {
  providers: [
    tableDataProviders,
    getTVChartDefaultProviders()
  ]
};
