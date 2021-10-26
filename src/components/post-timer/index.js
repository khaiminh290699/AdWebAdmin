import { DatePicker, Divider, Typography, Table, Spin } from "antd";
import moment from "moment";
import React from "react";
import usePostTimerHook from "./hook";

const { Text } = Typography;

function PostTimer() {
  const { state, value, action } = usePostTimerHook();
  return (
    <Card title={<Text>Timer posting status for date {moment(state.inDate).format("DD/MM/YYYY")} { state.isLoading ? <Spin /> : null }</Text>}>
      <DatePicker value={state.inDate} onChange={action.onDatePickerChange} />
      <Divider />
      <Table 
        pagination={false}
        dataSource={state.timerPosts}
        columns={value.columns}
      />
    </Card>
  )
}

export default PostTimer;