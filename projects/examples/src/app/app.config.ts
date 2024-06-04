import { ApplicationConfig } from '@angular/core';
import {tableDataProviders} from "./loader/arrow_loader";


export const appConfig: ApplicationConfig = {
  providers: [tableDataProviders]
};
