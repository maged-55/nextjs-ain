// pages/index.tsx
import DashboardLayout from '../../component/layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Row, Col, Table, message, Layout, Tag } from 'antd';
import { supabase } from '../../supabaseClient';

const OverviewPage = () => {
  const [form] = Form.useForm();
  const [plates, setPlates] = useState<any[]>([]);
  const router = useRouter();

  const fetchPlates = async () => {
    try {
      const { data, error } = await supabase
        .from('plate')
        .select('*');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      setPlates(data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    fetchPlates();
  }, []);

  const onFinish = async (values: { letters: string; numbers: string }) => {
    try {
      const { data, error } = await supabase
        .from('plate')
        .insert([{ plate: values.numbers+values.letters, status: 'notFind' }]);

      if (error) throw error;

      message.success('تم حفظ لوحة السيارة بنجاح!');
      console.log('Data inserted:', data);

      fetchPlates();
    } catch (error) {
      console.error('Error inserting data:', error);
      message.error('فشل في حفظ لوحة السيارة.');
    }
  };

  const columns = [
    {
      title: 'تاريخ البلاغ',
      dataIndex: 'created_at',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'لوحة السيارة',
      dataIndex: 'plate',
      key: 'plate',
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'notFind' ? 'orange' : 'red';
        
        let statusText = status === 'notFind' ? 'لم يتم العثور عليه' : 'تم العثور عليه';

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: 'الإجراء',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => router.push(`/details/${record.id}`)}>تفاصيل</Button>
      ),
    },
  ];

  return (
    <Layout>
      <DashboardLayout>
        <h1>البلاغات</h1>
        <Form
          form={form}
          name="license-plate-form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ letters: '', numbers: '' }}
          style={{ direction: 'rtl' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="letters"
                label="الأحرف"
                style={{ direction: 'rtl' }}
                rules={[
                  {
                    required: true,
                    message: 'يرجى إدخال الجزء الحرفي من لوحة السيارة',
                  },
                ]}
              >
                <Input placeholder="أدخل الأحرف" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numbers"
                label="الأرقام"
                rules={[
                  {
                    required: true,
                    message: 'يرجى إدخال الجزء الرقمي من لوحة السيارة',
                  },
                ]}
              >
                <Input placeholder="أدخل الأرقام" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              حفظ
            </Button>
          </Form.Item>
        </Form>

        <h2>البلاغات القائمة</h2>
        <Table
          dataSource={plates}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={false}
          bordered
          style={{ marginTop: '20px' }}
        />
      </DashboardLayout>
    </Layout>
  );
};

export default OverviewPage;
