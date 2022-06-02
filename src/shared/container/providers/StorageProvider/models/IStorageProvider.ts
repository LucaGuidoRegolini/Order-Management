interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
  deleteFileInTmpFolder(file: string): Promise<void>;
}

export { IStorageProvider };
