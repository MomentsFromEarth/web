import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentIndexComponent } from './moment-index.component';

describe('MomentIndexComponent', () => {
  let component: MomentIndexComponent;
  let fixture: ComponentFixture<MomentIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
