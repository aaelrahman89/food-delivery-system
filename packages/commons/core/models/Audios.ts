import { EntityId } from '../types';
import { EnumClass } from './EnumClass';
import { createBackendUrl } from '../../shell/backend/backend';

export type AudioUrlString = string;
export class AudioRefType extends EnumClass {
  static ERRAND_ITEM_VOICE = new AudioRefType('errandItemVoice');

  protected readonly _prefix: string;

  constructor(value: string) {
    super(value);
    this._prefix = 'AUDIO_REF_TYPE';
  }
}
export function createAudioUrl(
  options: AudioUrlCreationOptions
): AudioUrlString {
  return createBackendUrl({
    url: '/api/v1/audios',
    query: {
      referenceType: options.refType.valueOf(),
      referenceId: options.refId,
    },
  });
}

interface AudioUrlCreationOptions {
  refType: AudioRefType;
  refId: EntityId;
}
