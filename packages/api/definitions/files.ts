export type SingleFileRequest = void;

export interface SingleFileResponse {
  id: number;
  signedUrl: string;
  referenceId: number;
  referenceType: string;
}
