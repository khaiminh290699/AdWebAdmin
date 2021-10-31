import { DatePicker, Divider, Typography, Table, Spin, Card, Space, Switch } from "antd";
import moment from "moment";
import React from "react";
import usePostTimerHook from "./hook";

const { Text } = Typography;

function PostTimer() {
  const { context, state, value, action } = usePostTimerHook();
  return (
    <Card title={<Text>Timer Posting Status For Date {moment(state.inDate).format("DD/MM/YYYY")} { state.isLoading ? <Spin /> : null }</Text>}>
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
      <DatePicker value={state.inDate} onChange={action.onDatePickerChange} />
      <Divider />
      <Table 
        pagination={{ total: state.total, pageSize: value.limit, pageSizeOptions: [value.limit], onChange: action.onPaginationChange }}
        dataSource={state.timerPosts}
        columns={value.columns}
      />
    </Card>
  )
}

export default PostTimer;