import { api } from "./api";

export interface UploadResponse {
  url: string;
}

export const uploadService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload<UploadResponse>("/upload", formData);
  }
};
