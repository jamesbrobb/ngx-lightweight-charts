import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Issue5Component } from './issue-5.component';

describe('Issue5Component', () => {
  let component: Issue5Component;
  let fixture: ComponentFixture<Issue5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Issue5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Issue5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
