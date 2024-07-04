import { AvatarPipe } from "./avatar.pipe";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ AvatarPipe, ],
  exports: [ AvatarPipe, ],
})
export class CustomPipesModule {}
