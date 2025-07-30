'use client';

import React, { useEffect, useState } from 'react';
import { ApiBaseUrlLocal } from '../../../../const';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';


interface CertificateFile {
  title: string;
  s3url: string;
}

interface CertificateApiResponse {
  files: {
    doctorId: string;
    files: CertificateFile[];
  }[];
}

interface CertificateProps {
  doctorId: string;
}

const Certificate: React.FC<CertificateProps> = ({ doctorId }) => {
  const { t } = useTranslation();

  const [uploadedCertificates, setUploadedCertificates] = useState<CertificateFile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ApiBaseUrlLocal}/api/doctor/certificate/${doctorId}`);
      const data: CertificateApiResponse = await response.json();

      // ✅ Get the first entry in "files", then access its "files" array
      const certList = data?.files?.[0]?.files || [];
      setUploadedCertificates(certList);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toast.error(t('certificates.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchCertificates();
    }
  }, [doctorId]);

  return (
    <div className="w-full p-4">
      {loading ? (
        <p className="text-center text-gray-500">{t('certificates.loading')}</p>
      ) : uploadedCertificates.length > 0 ? (
        uploadedCertificates.map((cert, index) => (
          <div key={index} className="mb-6">
            {t('certificates.title')}: {cert.title}
            <img
              src={cert.s3url}
              alt={cert.title}
              className="w-full max-w-md mx-auto h-56 object-contain rounded-lg shadow"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">{t('certificates.empty')}</p>
      )}
    </div>
  );
};

export default Certificate;
