import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownStructControlComponent } from './dropdown-struct-control.component';


describe('DropdownStructControlComponent', () => {
  let component: DropdownStructControlComponent;
  let fixture: ComponentFixture<DropdownStructControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownStructControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownStructControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
