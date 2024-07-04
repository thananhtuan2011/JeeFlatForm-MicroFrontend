import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  playAudioComment() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/comment.mp3";
    audio.load();
    audio.play();
  }
  playAudiocallVideo() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/nhaccall.mp3";
    audio.load();
    audio.play();
  }
  playAudiocallWait() {
   
    
  }
  pauseAudiocallWait() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/nhaccho.mp3";
    audio.load();
    audio.pause()
  }
  playAudioNotification() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/notification.mp3";
    audio.load();
    audio.play();
  }

  playAudioMessage() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/pristine-message.mp3";
    audio.load();
    audio.play();
  }

  playAudioReactionLike() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/press-like.mp3";
    audio.load();
    audio.play();
  }
}
