import { AllowUpdateStatus } from "./allow_update_status.pipe";
import { AvatarPipe } from "./avatar.pipe";
import { TimezonePipe } from "./timezone.pipe";
import { NgModule } from "@angular/core";
import { FilterJWPipe } from "./filter.pipe";
import { SafeHtmlPipe } from "./safeHtml.pipe";

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [TimezonePipe, AvatarPipe, AllowUpdateStatus, FilterJWPipe, SafeHtmlPipe],
  exports: [TimezonePipe, AvatarPipe, AllowUpdateStatus, FilterJWPipe, SafeHtmlPipe],
})
export class CustomPipesModule { }
