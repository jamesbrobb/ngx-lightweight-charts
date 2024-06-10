import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVBaselineChartComponent } from './baseline-chart.component';

describe('BaselineChartComponent', () => {
  let component: TVBaselineChartComponent;
  let fixture: ComponentFixture<TVBaselineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVBaselineChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVBaselineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
