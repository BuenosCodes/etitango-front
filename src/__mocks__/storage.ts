export const uploadFile = jest.fn().mockResolvedValue('https://example.com/file.pdf');
export const getFileUrl = jest.fn().mockResolvedValue('https://example.com/file.pdf');
export const deleteFile = jest.fn().mockResolvedValue(undefined);

export const mockStorage = {
  uploadFile,
  getFileUrl,
  deleteFile,
}; 