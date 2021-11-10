import { Card, Typography, Table, Divider, Space, Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import useWebManageHook from "./hook";
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

function WebManage() {
  const { state, value, action } = useWebManageHook();
  return (
    <Card title={<Text>Web Manage</Text>}>
      <Space>
        <Button type="primary">
          <Link to="/web/create">
            <Text strong>
              <PlusOutlined />Create</Text>
            </Link>
        </Button>
      </Space>
      <Divider />
      <Table 
        dataSource={state.webs}
        columns={value.columns}
        pagination={{
          current: state.page,
          total: state.total,
          pageSize: value.limit,
          pageSizeOptions: [value.limit],
          onChange: action.onPaginationChange
        }}
      />
    </Card>
  )
}

export default WebManage;