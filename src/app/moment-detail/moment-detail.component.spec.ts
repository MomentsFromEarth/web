import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentDetailComponent } from './moment-detail.component';

describe('MomentDetailComponent', () => {
  let component: MomentDetailComponent;
  let fixture: ComponentFixture<MomentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
