import { Button, Card, Divider, Space, Switch, Typography, Table, Spin } from "antd";
import React from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import usePostManageHook from "./hook";

const { Text } = Typography;

function PostManage() {

  const { context, state, action, value } = usePostManageHook();

  return (
    <Card title={<Text>Post Manage {state.isLoading ? <Spin /> : null}</Text>}>
      {/* switch active mode if user is admin */}
      {
        context.user && context.user.isAdmin ?
        <>
          <Space>
            <Text>Admin mode :</Text> <Switch checked={state.mode === "admin"} onChange={action.onAdminModeChange}/>
          </Space>
          <Divider/>
        </>
        :
        null
      }
      <Space>
        <Button type="primary">
          <Link to="/post/create">
            <Text strong>
              <PlusOutlined />Create</Text>
            </Link>
        </Button>
      </Space>
      <Divider/>
      <Table 
        dataSource={state.posts}
        columns={value.columns}
        pagination={{ disabled: state.isLoading, current: state.page, pageSize: value.limit, total: state.total, pageSizeOptions: [value.limit], onChange: action.onPaginationChange }}
      />
    </Card>
  )
}

export default PostManage;