import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVCandleStickChartComponent } from './candle-stick-chart.component';
import {Time} from "lightweight-charts";

describe('TVCandleStickChartComponent', () => {
  let component: TVCandleStickChartComponent<Time>;
  let fixture: ComponentFixture<TVCandleStickChartComponent<Time>>;

  /*beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVCandleStickChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVCandleStickChartComponent<Time>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });*/

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
