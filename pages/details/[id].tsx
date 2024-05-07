import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import DashboardLayout from '../../component/layout';
import { Descriptions, Spin } from 'antd';
import dynamic from 'next/dynamic';

// Dynamically load MapPage without SSR
const MapPage = dynamic(() => import('../../component/mapPage'), {
    ssr: false,
});

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plate, setPlate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialPoints, setInitialPoints] = useState<[number, number][] | null>(null);

  useEffect(() => {
    const fetchPlateDetails = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('plate')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setPlate(data);
          if (data.status === 'find' && data.points) {
            setInitialPoints(data.points);
          }
        }

        setLoading(false);
      }
    };

    fetchPlateDetails();
  }, [id]);

  return (
    <DashboardLayout>
      <h1>Plate Details</h1>
      {loading ? (
        <Spin />
      ) : (
        <>
          {plate && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Date">
                {new Date(plate.created_at).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="License Plate">
                {plate.plate} 
              </Descriptions.Item>
            </Descriptions>
          )}
          {initialPoints && <MapPage points={initialPoints} />}
        </>
      )}
    </DashboardLayout>
  );
};

export default DetailsPage;
