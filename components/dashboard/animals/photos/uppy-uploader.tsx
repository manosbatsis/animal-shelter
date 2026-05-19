'use client';

import { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/dashboard';
import XHRUpload from '@uppy/xhr-upload';

import '@/node_modules/@uppy/core/dist/style.min.css';
import '@/node_modules/@uppy/dashboard/dist/style.min.css';

import { addAnimalImage } from '@/app/lib/actions/animal.actions';
import { toast } from 'sonner';

interface UppyUploaderProps {
  animalId: string;
}

interface UploadResponse {
  body?: {
    url?: string;
  };
}

const UppyUploader = ({ animalId }: UppyUploaderProps) => {
  const [uppy] = useState(() =>
    new Uppy({
      debug: true,
      autoProceed: true,
    }).use(XHRUpload, {
      endpoint: '/api/upload-to-blob',
      formData: true,
      fieldName: 'file',
    })
  );

  useEffect(() => {
    // Set metadata once the component has the animalId
    uppy.setMeta({ animalId });

    const handleUploadSuccess = async (file: unknown, response: unknown) => {
      const res = response as UploadResponse;

      if (res?.body?.url) {
        try {
          const result = await addAnimalImage(animalId, res.body.url);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        } catch {
          toast.error('Failed to save image to the database.');
        }
      }
    };

    uppy.on('upload-success', handleUploadSuccess);

    // Cleanup listeners when the component unmounts
    return () => {
      uppy.off('upload-success', handleUploadSuccess);
    };
  }, [uppy, animalId]);

  return (
    <div>
      <Dashboard
        uppy={uppy}
        hideProgressAfterFinish={true}
        note="Images will be saved to the animal's record upon successful upload."
        proudlyDisplayPoweredByUppy={false}
        width={'100%'}
      />
    </div>
  );
};

export default UppyUploader;