export class APIMediaPhoto {
  public readonly fileId: string;
  public readonly uniqueId: string;
  public readonly width: number;
  public readonly height: number;
  public readonly fileSize?: number;

  constructor(data: any) {
    this.fileId = data.file_id;
    this.uniqueId = data.unique_id;
    this.width = data.width;
    this.height = data.height;
    this.fileSize = data.file_size;
  }
}
