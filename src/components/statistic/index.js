import { Card, Spin, Typography } from "antd";
import React from "react";

import { Line } from '@ant-design/charts';
import useStatisticHook from "./hook";

const { Text } = Typography;

function Statistic() {
  const { state } = useStatisticHook();
  return (
    <Card title={<Text>Statistic {state.isLoading ? <Spin /> : null}</Text>}>
      <Line 
        data = {state.inTime}
        xField = "time"
        yField = "value"
        
        // yAxis = {
        //   {
        //     label: {
        //       formatter: function formatter(v) {
        //         return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        //           return ''.concat(s, ',');
        //         });
        //       },
        //     },
        //   }
        // }
        seriesField = "type"

        color = {(_ref) => {
          var type = _ref.type;
          return type === "user_click_link" ? '#F4664A' : type === "amount_post_timer" ? '#30BF78' : '#FAAD14';
        }}

      />
    </Card>
  )
}

export default Statistic;