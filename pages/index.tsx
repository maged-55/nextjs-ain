import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '.././supabaseClient';
import DashboardLayout from '.././component/layout';
import { Descriptions, Spin } from 'antd';
import dynamic from 'next/dynamic';

// Dynamically load MapPage without SSR
const HomeMap = dynamic(() => import('.././component/homeMap'), { ssr: false });

const DetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [plate, setPlate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialPoints, setInitialPoints] = useState<[number, number][][] | null>([
    [
      [24.71689071038911, 46.67325487824405],
      [24.75535469788335, 46.634278338613285],
    ],
    [
      [24.769332236299785, 46.64314730430681],
      [24.74512091373306, 46.70546442319801],
    ],
    [
      [24.727967539578216, 46.754795518984565],
      [24.694108948690584, 46.72628913218068],
    ],
    [
      [24.700610718519833, 46.771202121396755],
      [24.652443348267997, 46.792357279631915],
    ],
    [
      [24.626819393462313, 46.74062432336825],
      [24.633240808561588, 46.72379647625871],
    ],
  ]);

  return (
    <DashboardLayout>
      <h1> كاميرات المراقبة</h1> 
      <HomeMap points={initialPoints} />
    </DashboardLayout>
  );
};

export default DetailsPage;