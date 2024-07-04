import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeeteamComponent } from './jeeteam.component';

describe('JeeteamComponent', () => {
  let component: JeeteamComponent;
  let fixture: ComponentFixture<JeeteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeeteamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JeeteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
