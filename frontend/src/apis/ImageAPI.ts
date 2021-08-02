import { BUCKET_URL } from "../config.json";

interface UploadImageResponse {
  id: string;
  status: number;
}

export async function upload(image: Blob): Promise<UploadImageResponse> {
  const formData = new FormData();
  const BlobToFile = new File([image], "image.png", {
    type: "image/png",
  });

  formData.append("file", BlobToFile);

  const response = await fetch(`${BUCKET_URL}/file`, {
    body: formData,
    method: "POST",
  });

  const responseObject = await response.json();

  return { ...responseObject, status: response.status };
}
export const ImageApi = {
  upload,
};
