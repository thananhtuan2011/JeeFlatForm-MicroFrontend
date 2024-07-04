import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNameTeamComponent } from './edit-name-team.component';

describe('EditNameTeamComponent', () => {
  let component: EditNameTeamComponent;
  let fixture: ComponentFixture<EditNameTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNameTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
