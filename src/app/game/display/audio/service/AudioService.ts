import { sound } from "@pixi/sound";
import { AudioAIDs } from "../enum/AudioAIDs";
import { AudioMetadata } from "../interface/AuidioMetadata";
import { audioMetadataConfig } from "../config/AudioMetadataConfig";

export class AudioService {
  init(): Promise<boolean> {
    return new Promise<boolean>((resolve: Function, reject: Function) => {
      let loadedCount = 0;

      audioMetadataConfig.forEach((audioMetadata: AudioMetadata) => {
        sound.add(audioMetadata.aid, {
          url: audioMetadata.path,
          preload: true,

          loaded: function (err) {
            if (err) {
              reject(false);
            }

            loadedCount++;

            if (loadedCount >= audioMetadataConfig.size) {
              resolve(true);
            }
          },
        });
      });
    });
  }

  play(aid: AudioAIDs): void {
    const audioMetadata = audioMetadataConfig.get(aid);

    if (audioMetadata && ((audioMetadata.isSingleInstance && !sound.isPlaying()) || !audioMetadata.isSingleInstance)) {
      sound.play(aid);
    }
  }
}
