# Task: Phase 1 - Implement Product Image Uploading

## 1. Feature Requirements
Implement image upload capabilities in the frontend admin panel. Instead of administrators manually typing S3 URLs for product images, they should be able to select or drag-and-drop local image files, which will be uploaded to the backend S3 server using the existing `/upload` endpoint, and the returned URLs will be automatically populated in the product form.
* **API Utility Extension**: Update the React frontend's fetch wrapper in `api.ts` to properly handle `FormData` payloads for multipart file uploads without stripping boundary parameters.
* **Upload Service Creation**: Create a client service to interface with the backend `/upload` controller endpoint.
* **Admin UI Integration**: Replace the current text inputs for "Main Image" and "Sub Images" in `AdminPage.tsx` with modern file uploaders that handle uploading state, display image previews, and handle upload errors.

---

## 2. Implementation Steps (Numbered, Sequential)

1. **Extend API Request Utility**:
   - Edit [api.ts](file:///E:/intelljProject/flix-plaftform/fe/src/services/api.ts).
   - Update the `request` function so that if `options.body` is an instance of `FormData`, it deletes the default `'Content-Type'` header so the browser can automatically set it along with the appropriate boundaries:
     ```typescript
     const headers: Record<string, string> = {
       ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
       ...(token ? { Authorization: `Bearer ${token}` } : {}),
     };
     ```
   - Add a dedicated `upload` method to the exported `api` object:
     ```typescript
     export const api = {
       // ... existing methods
       upload: <T>(endpoint: string, formData: FormData) =>
         request<T>(endpoint, {
           method: 'POST',
           body: formData,
         }),
     };
     ```

2. **Create Upload Service**:
   - Create a file [upload.service.ts](file:///E:/intelljProject/flix-plaftform/fe/src/services/upload.service.ts) inside `fe/src/services/` that exports an upload service:
     ```typescript
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
     ```

3. **Refactor Product Form in AdminPage.tsx**:
   - Open [AdminPage.tsx](file:///E:/intelljProject/flix-plaftform/fe/src/pages/admin/AdminPage.tsx).
   - Implement an image upload helper function that validates file size (e.g. < 5MB) and type (`image/*`), manages the upload state, and calls `uploadService.uploadFile`.
   - **Main Image Section**:
     - Refactor the input group around line 845.
     - Replace the raw URL input with a file selection button and/or drag-and-drop container.
     - Show a loading spinner during the upload.
     - Display a preview of the main image with a "Remove" button once uploaded.
   - **Sub Images Section**:
     - Refactor the input group around line 853.
     - Replace the comma-separated text input with a multi-file upload button.
     - Show list/grid of thumbnail previews for the uploaded sub-images with the option to remove individual images from the list.

---

## 3. Technical Considerations
* **Multipart Boundary Header**: When uploading using `FormData`, the browser automatically computes the boundary string and sets `Content-Type: multipart/form-data; boundary=...`. Setting `Content-Type: multipart/form-data` manually will cause the upload to fail because the boundary parameter will be missing.
* **Authentication**: The `/upload` endpoint is secured by default. Ensure the Authorization header containing the Bearer token is properly attached via `api.ts`.
* **User Feedback**: Provide immediate UI indicators (loading spinners/progress bars) during the upload sequence and display friendly alert messages in case of API failure.

---

## 4. Validation Checkpoints
* **Compilation**: Build the frontend using `npm run build` or `npm run dev` to ensure type checks and compilation pass.
* **Upload Inspection**: Using browser DevTools, verify that uploading an image sends a `POST` request to `http://localhost:8080/upload` with the `Authorization` header, and payload of type `multipart/form-data`, returning `200 OK` with a valid S3 URL response format `{ "url": "..." }`.
* **Form Submission**: Verify that saving/updating a product successfully persists the new image URLs on the backend.
