import { Card, Space, Table, Tooltip, Typography, Input, Modal, Button, Divider, Select, Spin, Switch, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import Api from "../../api";
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import useAccountManageHook from "./hook";

const { Text, Link } = Typography;
const { Option } = Select;

function AccountManage() {
  const api = new Api();
  const { context, state, action, value } = useAccountManageHook();
  return (
    <Card title="Account Manage">
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
      {/* admin mode */}
      {
        state.mode != "admin" ?
        <>
          <Space>
            <Button type="primary" onClick={action.onCreate}><Text strong><PlusOutlined />Create new</Text></Button>
            {/* <Tooltip>
              <Button type="default" onClick={action.onSave}><Text strong><SaveOutlined /> Save</Text></Button>
            </Tooltip> */}
            {
              state.isLoading ? <Spin /> : <></>
            }
          </Space>
          <p />
          {
            state.listInsertButDisable.map((item, index) => {
              const web = state.webs.filter((webs) => webs.id === item.web_id)[0] || {};
              return (
                <>
                <Space>
                  <Text type="danger">Accounts username : <Text type="danger" strong>{item.username}</Text> of website {web.web_name} already exist but is disbale now.</Text>
                </Space>
                <p />
                {
                  index === state.listInsertButDisable.length - 1 ?
                  <Text strong>Please contact with admin to enable this account</Text>
                  : null
                }
                </>
              )
            })
          }
          <Divider/>
        </>
        :
        null
      }
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
        pagination={state.mode === "admin" ? { current: state.page, total: state.total, pageSize: value.limit, pageSizeOptions: [value.limit], onChange: action.onPaginationChange } : false}
        rowKey="id"
      />
    </Card>
  )
}

export default AccountManage;