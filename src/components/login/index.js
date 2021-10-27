import { Button, Card, Form, Input, Spin, Typography } from "antd";
import React from "react";
import { Redirect } from "react-router";
import useLoginHook from "./hook";

const { Text } = Typography;

function Login() {
  const { state, action } = useLoginHook();
  if (localStorage.getItem("token")) {
    return <Redirect to="" />
  }
  return (
    <Card title={<Text>Login {state.isLoading ? <Spin /> : null} </Text>}>
      <Form name="basic"
        onFinish={action.onFinish}
        onFinishFailed={action.onFinishFailed}
      >
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        {
          state.error.message ? <Text type="danger"> {state.error.message} </Text> : null
        }
        <Form.Item>
          <Button disabled={state.isLoading} type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Login;