import { Card, Typography, Table, Divider, Space, Input, Button } from "antd";
import React from "react";
import { Redirect } from "react-router";
import useUserManageHook from "./hook";

const { Text } = Typography;

function UserManage() {
  const { context, state, value, action } = useUserManageHook();
  if (context.user && !context.user.isAdmin) {
    return <Redirect to="/" />
  }
  return (
    <Card title={<Text>User Manage</Text>}>
      {
        context.user && context.user.isAdmin ?
        <>
          <Space size="large">
            <Text strong>Username: </Text>

            <Input 
              value={state.username} 
              style={{ width: "380px" }} 
              onChange={action.onUsernameChange}
            />

            <Text strong>Password: </Text>

            <Input 
              type="password" 
              value={state.password} 
              style={{ width: "380px" }} 
              onChange={action.onPasswordChange}
            />

            <Button type="primary" onClick={action.onCreateUser}>Create user</Button>
          </Space>
          <p />
          {
            state.error.create ? <Text strong type="danger">{ state.error.create }</Text> : null
          }
          <Divider />
        </>
        : null
      }
      <Table 
        dataSource={state.users}
        columns={value.columns}
        pagination={{ current: state.page, pageSize: value.limit, pageSizeOptions: [value.limit], total: state.total, onChange: action.onPaginationChange }}
        rowKey="id"
      />
    </Card>
  )
}

export default UserManage;