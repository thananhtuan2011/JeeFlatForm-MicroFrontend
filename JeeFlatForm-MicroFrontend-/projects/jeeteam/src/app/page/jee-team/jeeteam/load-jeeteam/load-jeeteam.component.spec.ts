import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadJeeteamComponent } from './load-jeeteam.component';

describe('LoadJeeteamComponent', () => {
  let component: LoadJeeteamComponent;
  let fixture: ComponentFixture<LoadJeeteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadJeeteamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadJeeteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
