import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNameChanelComponent } from './edit-name-chanel.component';

describe('EditNameChanelComponent', () => {
  let component: EditNameChanelComponent;
  let fixture: ComponentFixture<EditNameChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNameChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNameChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
