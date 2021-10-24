import { Card, Space, Table, Tooltip, Typography, Input, Modal, Button, Divider, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../api";
import PasswordHidden from "./password";
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import useAccountManageHook from "./hook";

const { Text, Link } = Typography;
const { Option } = Select;

function AccountManage() {
  const api = new Api();
  const { state, action, value } = useAccountManageHook();

  return (
    <Card title="Account Manage">
      <Space>
        <Button type="primary" onClick={action.onCreate}><Text strong><PlusOutlined />Create new</Text></Button>
        <Tooltip>
          <Button type="default" onClick={action.onSave}><Text strong><SaveOutlined /> Save</Text></Button>
        </Tooltip>
        {
          state.isLoading ? <Spin /> : <></>
        }
      </Space>
      <Divider/>
      <Modal title="Edit account" visible={ state.creating || state.edited != undefined } onCancel={action.onCancel}
        footer={[
          <Button type="primary" onClick={action.onEdit}>
            { state.creating ? "Create" : "Edit" }
          </Button>
        ]}
      >
        <table width="100%">
          <tr>
            <td><Text strong>Website :</Text></td>
            <td>
              {
                !state.creating ?
                <Link strong href={state.edited ? state.edited.web_url : "#"}>{state.edited ? state.edited.web_name : ""}</Link>
                :
                <Select defaultValue={state.webs[0].id}
                  onChange={(value) => action.onChange(value, "web_id")}
                >
                  {
                    state.webs.map((web) => <Option value={web.id}>
                      <Tooltip title={
                      <table>
                        <tr>
                          <td><Text strong>URL :</Text></td>
                          <td><Link href={web.web_url}>{web.web_url}</Link></td>
                        </tr>
                        <tr>
                          <td><Text strong>Key :</Text></td>
                          <td><Text type="secondary">{web.web_key}</Text></td>
                        </tr>
                      </table>
                    }> {web.web_name}</Tooltip>
                    </Option>)
                  }
                </Select>
              }
            </td>
          </tr>
          <br></br>
          <tr>
            <td><Text strong>Username :</Text></td>
            <td><Input value={state.username} onChange={(event) => action.onChange(event.target.value, "username")}></Input></td>
          </tr>
          <br></br>
          <tr>
            <td><Text strong>Password :</Text></td>
            <td><Input type="password" value={state.password} onChange={(event) => action.onChange(event.target.value, "password")}></Input></td>
          </tr>
        </table>
      </Modal>
      <Table
        bordered={true}
        columns={value.columns} 
        dataSource={state.accounts}
        pagination={false}
        rowKey="id"
      />
    </Card>
  )
}

export default AccountManage;