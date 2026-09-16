import { AVATAR_SIZE } from "@/lib/auth/schemas";

/** A square region of the source image, in its natural pixels. */
export interface CropRect {
  x: number;
  y: number;
  size: number;
}

/** Decodes the chosen file once; honours EXIF orientation so phone photos are not sideways. */
export function loadAvatarSource(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

/** The largest centred square — the starting crop before the user moves it. */
export function centredCrop(bitmap: ImageBitmap): CropRect {
  const size = Math.min(bitmap.width, bitmap.height);
  return { x: (bitmap.width - size) / 2, y: (bitmap.height - size) / 2, size };
}

/** Paints `crop` scaled to fill a square canvas of `outputSize` — shared by the preview and the upload. */
export function drawCrop(
  context: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  crop: CropRect,
  outputSize: number,
) {
  context.clearRect(0, 0, outputSize, outputSize);
  context.drawImage(bitmap, crop.x, crop.y, crop.size, crop.size, 0, 0, outputSize, outputSize);
}

/**
 * Renders the chosen crop at AVATAR_SIZE so the upload is a few kilobytes
 * regardless of what the camera produced. Prefers WebP; browsers that cannot
 * encode it hand back PNG, which the server also accepts.
 */
export async function renderAvatar(bitmap: ImageBitmap, crop: CropRect): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process the image");
  }

  drawCrop(context, bitmap, crop, AVATAR_SIZE);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85),
  );
  if (!blob) {
    throw new Error("Could not process the image");
  }

  return new File([blob], "avatar", { type: blob.type });
}
