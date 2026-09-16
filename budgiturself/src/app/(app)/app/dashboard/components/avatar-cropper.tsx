"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";
import {
  centredCrop,
  drawCrop,
  loadAvatarSource,
  renderAvatar,
  type CropRect,
} from "../lib/prepare-avatar";

/** Preview edge in CSS pixels; it fits the dialog at phone width with room to spare. */
const VIEWPORT = 240;
const MAX_ZOOM = 4;

interface AvatarCropperProps {
  file: File;
  pending: boolean;
  onCancel: () => void;
  onSave: (avatar: File) => void;
}

function clampCrop(crop: CropRect, bitmap: ImageBitmap): CropRect {
  return {
    size: crop.size,
    x: Math.min(Math.max(crop.x, 0), bitmap.width - crop.size),
    y: Math.min(Math.max(crop.y, 0), bitmap.height - crop.size),
  };
}

/**
 * Drag the photo to reposition it inside a fixed square; the slider zooms
 * about the centre. The preview is drawn with the same call that renders
 * the upload, so what the user sees is exactly what gets saved.
 */
export function AvatarCropper({ file, pending, onCancel, onSave }: AvatarCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    let source: ImageBitmap | null = null;

    loadAvatarSource(file)
      .then((loaded) => {
        if (cancelled) {
          loaded.close();
          return;
        }
        source = loaded;
        setBitmap(loaded);
        setCrop(centredCrop(loaded));
      })
      .catch(() => setError("Could not read that image"));

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [file]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !bitmap || !crop) {
      return;
    }

    // Draw at device resolution so the preview is as sharp as the page.
    const scale = window.devicePixelRatio || 1;
    canvas.width = VIEWPORT * scale;
    canvas.height = VIEWPORT * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    drawCrop(context, bitmap, crop, VIEWPORT);
  }, [bitmap, crop]);

  if (!bitmap || !crop) {
    return (
      <div className="flex flex-col items-center gap-3 pt-6 pb-5">
        <div className="grid size-60 place-items-center rounded-lg border border-hairline bg-quiet">
          {error ? (
            <FieldError message={error} />
          ) : (
            <Loader2 className="size-5 animate-spin text-ink-ghost" />
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  const maxSize = Math.min(bitmap.width, bitmap.height);
  const zoom = maxSize / crop.size;

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    // One preview pixel covers `crop.size / VIEWPORT` source pixels.
    const ratio = crop.size / VIEWPORT;
    const next = clampCrop(
      {
        ...crop,
        x: crop.x - (event.clientX - drag.x) * ratio,
        y: crop.y - (event.clientY - drag.y) * ratio,
      },
      bitmap,
    );
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    setCrop(next);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const handleZoom = (nextZoom: number) => {
    const size = maxSize / nextZoom;
    setCrop(
      clampCrop(
        { size, x: crop.x + crop.size / 2 - size / 2, y: crop.y + crop.size / 2 - size / 2 },
        bitmap,
      ),
    );
  };

  const handleSave = async () => {
    try {
      onSave(await renderAvatar(bitmap, crop));
    } catch {
      setError("Could not process the image");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-6 pb-5">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Drag to reposition your photo"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="size-60 cursor-grab touch-none rounded-full border border-hairline bg-quiet active:cursor-grabbing"
        style={{ width: VIEWPORT, height: VIEWPORT }}
      />

      <label className="flex w-60 items-center gap-3 text-xs text-ink-faint">
        <span className="shrink-0">Zoom</span>
        <input
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(event) => handleZoom(Number(event.target.value))}
          className="w-full accent-brand"
        />
      </label>

      <p className="text-xs text-ink-faint">Drag the photo to reposition it.</p>
      <FieldError message={error} />

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" disabled={pending} onClick={handleSave}>
          {pending && <Loader2 className="animate-spin" />}
          Save photo
        </Button>
      </div>
    </div>
  );
}
