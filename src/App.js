import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  Row,
  Card,
  Col,
  Statistic,
  List,
  Button,
  DatePicker,
  Dropdown,
} from 'antd';
import { Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { Typography } from 'antd';
import './App.css';

import 'antd/dist/antd.css'; 
const { RangePicker } = DatePicker;
const { Title } = Typography;

function App() {
  const [purchases, setPurchases] = useState({});
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [newSeller, setNewSeller] = useState({});
  const [merchants, setMerchants] = useState({});
  const [sellers, setSellers] = useState({});
  const [median, setMedian] = useState({});
  
  const handleUpdateState = async (type, payload) => {
    reducer({
      type,
      payload,
    });
  };
  useEffect(() => {
    const end = moment().format('YYYY-MM-D');
    const payload = {
      start: '2019-10-18',
      end,
    };
    handleUpdateState('GetUsersCount', payload)
   
    handleUpdateState('GetProductsCountByInterval', payload)
    handleUpdateState('GetMerchants', payload)
    handleUpdateState('GetNewSellers', payload)
    handleUpdateState('GetUniqueSellers', payload)
    handleUpdateState('GetMerchantsMedian', payload)
    handleUpdateState('GetTransactions', payload)
  }, []);



  function onChange(date, dateString) {
    const payload = {
        start: dateString[0],
        end: dateString[1],
      };
      handleUpdateState('GetUsersCount', payload)
    console.log(dateString);
  }
  const reducer = async (action) => {
    let partition;
    switch (action.type) {
      case 'GetUsersCount':
        const userCount = await getStats(
          `/kpi/users/${action.payload.start}/${action.payload.end}`
        ); 
        return setUsers(userCount || {});
      case 'GetTransactions':
        partition = await getStats(
          `/kpi/transactions/${action.payload.start}/${action.payload.end}`
        );
        return setPurchases(partition || {});
      case 'GetProductsCountByInterval':
        partition = await getStats(
          `/kpi/products/${action.payload.start}/${action.payload.end}`
        );
        return setProducts(partition || {});
      case 'GetMerchants':
        partition = await getStats(
          `/kpi/merchants/${action.payload.start}/${action.payload.end}`
        );
        return setMerchants(partition || {});
      case 'GetNewSellers':
        partition = await getStats(
          `/kpi/sellers/first-time/${action.payload.start}/${action.payload.end}`
        );
        return setNewSeller(partition.new_seller || {});
      case 'GetUniqueSellers':
        partition = await getStats(
          `/kpi/sellers/${action.payload.start}/${action.payload.end}`
        );
        return setSellers(partition || {});
      case 'GetMerchantsMedian':
        partition = await getStats(
          `/kpi/merchants/median/${action.payload.start}/${action.payload.end}`
        );
        return setMedian(partition || {});
      default:
        return;
    }
  };

  return (
    <div className="app" style={{ padding: '20px 50px' }}>
      <Row>
        <Col span={4}>
          {' '}
          <Title mark level={3}>
            KPI Dashboard
          </Title>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
        
          <Card style={{ margin: '10px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Users" value={users.users} loading={!users} />
                <RangePicker format="YYYY-MM-DD" onChange={onChange} />
              </Col>
              <Col span={12}>
              <Statistic title="merchants" value={merchants.merchants} loading={!merchants} />
                <RangePicker format="YYYY-MM-DD" onChange={onChange} />
              </Col>
               
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          {' '}
          <Card style={{ margin: '10px' }}>
          <Statistic title="products" value={products.products} loading={!products} />
                <RangePicker format="YYYY-MM-DD" onChange={onChange} />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          {' '}
          <Card
            title="Transactions"
            type="inner"
            style={{ margin: '10px' }}
          >
            <RangePicker format="YYYY-MM-DD" onChange={onChange} />
            <List
              size="small"
              header={null}
              footer={null}
              dataSource={purchases.purchases || []}
              renderItem={(item) => <List.Item>{item.currency} {item.sales} {item.profit} {item.count} {item.merchant_revenue}</List.Item>}
            />
          </Card>
        </Col>
        <Col span={10}>
          {' '}
          <Card
            title="Sellers"
            type="inner"
            style={{ margin: '10px' }}
            
          >
               <Statistic title='With First Sales' value={newSeller.count}  />
              <RangePicker format="YYYY-MM-DD" onChange={onChange} />
              <Statistic title='New on the platform' value={sellers.sellers} loading={!sellers} />
              <RangePicker format="YYYY-MM-DD" onChange={onChange} />
          </Card>
        </Col>
        <Col span={4}>
          {' '}
          <Card
            title="Sellers Median Avg"
            type="inner"
            style={{ margin: '10px' }}

          >
                <Statistic value={median.median_val} loading={!median} />
              <RangePicker format="YYYY-MM-DD" onChange={onChange} />
          </Card>
        </Col>
      </Row>
    </div>
  );

}


 
async function getStats(url) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api${url}`);

    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}

export default App;
