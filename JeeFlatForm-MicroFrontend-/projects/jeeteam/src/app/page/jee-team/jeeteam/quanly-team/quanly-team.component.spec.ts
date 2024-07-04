import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlyTeamComponent } from './quanly-team.component';

describe('QuanlyTeamComponent', () => {
  let component: QuanlyTeamComponent;
  let fixture: ComponentFixture<QuanlyTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanlyTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanlyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
