import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideAdminComponent } from './guide-admin.component';

describe('GuideAdminComponent', () => {
  let component: GuideAdminComponent;
  let fixture: ComponentFixture<GuideAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuideAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
