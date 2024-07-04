import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownStructDetailsComponent } from './dropdown-struct-details.component';


describe('DropdownStructDetailsComponent', () => {
  let component: DropdownStructDetailsComponent;
  let fixture: ComponentFixture<DropdownStructDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownStructDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownStructDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
