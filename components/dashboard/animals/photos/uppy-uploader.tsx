"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import XHRUpload from "@uppy/xhr-upload";
import "@/node_modules/@uppy/core/dist/style.min.css";
import "@/node_modules/@uppy/dashboard/dist/style.min.css";
import { toast } from "sonner";

interface UppyUploaderProps {
  animalId: string;
}
interface UploadResponse {
  body?: {
    url?: string;
  };
}

const UppyUploader = ({ animalId }: UppyUploaderProps) => {
  const router = useRouter();

  const [uppy] = useState(() =>
    new Uppy({
      debug: true,
      autoProceed: true,
    }).use(XHRUpload, {
      endpoint: "/api/upload-to-blob",
      formData: true,
      fieldName: "file",
      allowedMetaFields: ["animalId"],
    }),
  );

  useEffect(() => {
    uppy.setMeta({ animalId });

    const handleUploadSuccess = (file: unknown, response: unknown) => {
      const res = response as UploadResponse;
      if (res?.body?.url) {
        toast.success("Image uploaded successfully!");
        router.refresh();
      } else {
        toast.error("Upload succeeded but no URL was returned.");
      }
    };

    const handleUploadError = (file: unknown, error: unknown) => {
      const err = error as Error;
      toast.error(err?.message || "Failed to upload image. Please try again.");
    };

    uppy.on("upload-success", handleUploadSuccess);
    uppy.on("upload-error", handleUploadError);

    return () => {
      uppy.off("upload-success", handleUploadSuccess);
      uppy.off("upload-error", handleUploadError);
    };
  }, [uppy, animalId, router]);

  return (
    <div>
      <Dashboard
        uppy={uppy}
        hideProgressAfterFinish={true}
        note="Images will be saved to the animal's record upon successful upload."
        proudlyDisplayPoweredByUppy={false}
        width={"100%"}
      />
    </div>
  );
};

export default UppyUploader;