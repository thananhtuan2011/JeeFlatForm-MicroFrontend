import { AllowUpdateStatus } from './allow_update_status.pipe';
import { TimezonePipe } from './timezone.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [
    TimezonePipe,
    AllowUpdateStatus,
  ],
  exports: [
    TimezonePipe,
    AllowUpdateStatus
  ]
})
export class ApplicationPipesModule {}
