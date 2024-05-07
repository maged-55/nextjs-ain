import { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import DashboardLayout from '../../component/layout';
import dynamic from 'next/dynamic';
import { UploadFile } from 'antd/lib/upload/interface';
import { supabase } from '../../supabaseClient';

const TrackingMap = dynamic(() => import('../../component/TrackingMap'), {
  ssr: false,
});

const { Dragger } = Upload;

const AnalyticsPage: React.FC = () => {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [plateExists, setPlateExists] = useState<boolean | null>(null);
  const [plate, setPlate] = useState<string>('');
  const [id, setId] = useState<number | null>(null);

  const handleUpload = async () => {
    if (!file) {
      message.error('يرجى تحديد صورة للتحميل');
      return;
    }

    const formData = new FormData();
    formData.append('upload', file as unknown as Blob);

    try {
      const response = await fetch('https://api.platerecognizer.com/v1/plate-reader/', {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Token d1e73b9def8a5bdc43cb82ff14c9b0044a18a12a' },
      });

      const result = await response.json();
      const recognizedPlate = result.results[0]?.plate;

      if (recognizedPlate) {
        const { data, error } = await supabase
          .from('plate')
          .select('id, plate')
          .eq('plate', recognizedPlate);

        if (error) {
          console.error('Error checking plate:', error);
          setPlateExists(false);
          message.error('حدث خطأ أثناء التحقق من اللوحة');
        } else {
          if (data && data.length > 0) {
            setId(data[0].id);
            setPlateExists(true);
            setPlate(recognizedPlate);
            message.success(`تم تحميل الصورة بنجاح. اللوحة: ${recognizedPlate}`);
          } else {
            setPlateExists(false);
            setPlate('');
            setId(null);
              message.warning('لم يتم العثور على اللوحة في قاعدة البيانات.');
              setFile(null);
          }
        }
      } else {
        setPlateExists(false);
        setPlate('');
        setId(null);
          message.error('لم يتم التعرف على لوحة.');
          setFile(null);
      }
      setFile(null);
      console.log('Response:', result);
    } catch (error) {
      console.error('Error uploading image:', error);
        message.error('فشل تحميل الصورة');
        setFile(null);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file: UploadFile) => {
      setFile(file);
      return false;
    },
    onRemove: () => setFile(null),
    accept: 'image/*',
  };

  return (
    <DashboardLayout>
      <h1>رصد المركبات</h1>
      {/* <p>مرحبًا بكم في صفحة التحليلات.</p> */}
      <Dragger
        {...uploadProps}
        style={{ marginBottom: '20px', maxHeight: '200px' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">انقر أو اسحب الملف لتحميله</p>
        <p className="ant-upload-hint">يرجى تحميل صورة</p>
      </Dragger>
      <Button type="primary" onClick={handleUpload}>
        تحميل الصورة
      </Button>
      {plateExists !== null && (
        <p>{plateExists ? 'تم العثور على اللوحة في قاعدة البيانات.' : 'لم يتم العثور على اللوحة في قاعدة البيانات.'}</p>
      )}
    
      <TrackingMap plateExists={plateExists} plate={plate} id={id} />
    </DashboardLayout>
  );
};

export default AnalyticsPage;
