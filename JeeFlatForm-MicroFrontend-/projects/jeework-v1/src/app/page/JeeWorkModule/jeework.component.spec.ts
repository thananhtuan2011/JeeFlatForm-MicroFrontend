import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JeeWorkComponent } from './jeework.component';


describe('JeeWorkComponent', () => {
  let component: JeeWorkComponent;
  let fixture: ComponentFixture<JeeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeeWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JeeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
