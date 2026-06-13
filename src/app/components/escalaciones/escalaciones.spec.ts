import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscalacionesComponent } from './escalaciones';

describe('EscalacionesComponent', () => {
  let component: EscalacionesComponent;
  let fixture: ComponentFixture<EscalacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalacionesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EscalacionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});