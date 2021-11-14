import { Card, Spin, Typography, Table, DatePicker, Select, Space, Row, Col, Divider } from "antd";
import React, { useEffect, useState } from "react";

import { Line, Pie } from '@ant-design/charts';
import useStatisticHook from "./hook";
import Api from "../../api";
import moment from "moment";

const { Text, Link } = Typography;
const { RangePicker } = DatePicker;

function Statistic() {
  const { state } = useStatisticHook();
  return (
    <Card title={<Text>Statistic {state.isLoading ? <Spin /> : null}</Text>}>
      <StatisticWeb />
      <Divider />
      <Row type="flex">  
        <Col xs={12}>
          <StatisticForum type="post" />
        </Col>
        <Col xs={12}>
          <StatisticForum type="clicked" />
        </Col>
      </Row>
      <Divider />
      <StatisticTimer />
    </Card>
  )
}

function StatisticWeb(props) {
  const api = new Api();
  const [state, setState] = useState({
    isLoading: true,
    forums: [],
    accounts: [],
    posts: [],
  })

  useEffect(async () => {
    setState({ ...state, isLoading: true });
    const rs = await api.getTotal();
    if (rs.status != 200) {
      return;
    }
    const { data: { forums, accounts, posts } } = rs;
    setState({ ...state, isLoading: false, forums, accounts, posts })
  }, [])

  return (
    <Card title={<Text>Website Statistic { state.isLoading ? <Spin /> : null }</Text>}>
      <Row type="flex">  
        <Col xs={8}>
          <Pie 
            appendPadding={10}
            data={state.forums}
            angleField="total"
            colorField="web_name"
            radius={0.9}
            label={{
              type: 'inner',
              offset: '-30%',
              content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
              },
              style: {
                fontSize: 14,
                textAlign: 'center',
              },
            }}
            interactions={[{ type: 'element-active' }]}
          />
          <div style={{ textAlign: "center" }}>
            <Text strong>Forum per web</Text>
          </div>
        </Col>

        <Col xs={8}>
        <Pie 
            appendPadding={10}
            data={state.accounts}
            angleField="total"
            colorField="web_name"
            radius={0.9}
            label={{
              type: 'inner',
              offset: '-30%',
              content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
              },
              style: {
                fontSize: 14,
                textAlign: 'center',
              },
            }}
            interactions={[{ type: 'element-active' }]}
          />
          <div style={{ textAlign: "center" }}>
            <Text strong>Account per web</Text>
          </div>
        </Col>

        <Col xs={8}>
          <Pie 
            appendPadding={10}
            data={state.posts}
            angleField="total"
            colorField="web_name"
            radius={0.9}
            label={{
              type: 'inner',
              offset: '-30%',
              content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
              },
              style: {
                fontSize: 14,
                textAlign: 'center',
              },
            }}
            interactions={[{ type: 'element-active' }]}
          />
          <div style={{ textAlign: "center" }}>
            <Text strong>Popular web <Text type="secondary">(by amount post)</Text></Text>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

function StatisticTimer(props) {
  const api = new Api()
  const [state, setState] = useState({
    isLoading: true,
    statistics: [],
    to: moment().endOf("date"),
    from: moment().startOf("date").subtract(3, "month")
  })

  useEffect(async () => {
    setState({ ...state, isLoading: true });
    const rs = await api.getInTime(state.from, state.to);
    if (rs.status != 200) {
      return;
    }
    const { data: { result: inTime } } = rs;
    setState({ ...state, isLoading: false, statistics: inTime })
  }, [state.to, state.from])

  return (
    <>
      <Text strong>Timer {`&`} Click Time { state.isLoading ? <Spin /> : null }</Text>
      <p />
      <RangePicker 
        value={{"0": state.from, "1": state.to}}
        onChange={(value) => {
          setState({ ...state, from: value[0].startOf("date"), to: value[1].endOf("date") })
        }}

      />
      <p />
      <Line 
        data = {state.statistics}
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
    </>
  )
}

function StatisticForum(props) {
  const api = new Api();
  const { type } = props;

  const limit = [10, 20, 50, 100];

  const [state, setState] = useState({
    isLoading: true,
    statistics: [],
    limit: 10,
    to: moment().endOf("date"),
    from: moment().startOf("date").subtract(3, "month")
  })

  useEffect(async () => {
    let rs;
    const { from, to, limit } = state;
    setState({ ...state, isLoading: true })
    if (type === "post") {
      rs = await api.getTopPostForum(from, to, limit);
    } else {
      rs = await api.getTopClickForum(from, to, limit);
    }
    if (rs.status != 200) {
      return;
    }
    const { data: { statistics } } = rs;
    setState({ ...state, isLoading: false, statistics })
  }, [state.from, state.to, state.limit])

  return (
    <Card style={{ width: "550px" }} title={<Text>{ type === "post" ? "Top chosen forums" : "Top clicked forums" } { state.isLoading ? <Spin /> : null } </Text>} >
      <Space>
        <Text strong>Range :</Text>
        <RangePicker 
          value={{"0": state.from, "1": state.to}}
          onChange={(value) => {
            setState({ ...state, from: value[0].startOf("date"), to: value[1].endOf("date") })
          }}

        />
        <Text strong>Limit :</Text>
        <Select value={state.limit} onChange={(value) => setState({ ...state, limit: value })}>
          {
            limit.map((value) => {
              return (
                <Select.Option value={value}>{value}</Select.Option>
              )
            })
          }
        </Select>
      </Space>
      <p />
      <Table 
        pagination={false}
        dataSource={state.statistics}
        columns={
          [
            { title: "Top", width: "5%", render: (_, __, index) => <Text strong>{index + 1}</Text> },
            { title: "Forum", width: "90%", render: (data) => {
              if (data.null) {
                return (
                  <Text>_ _ _</Text>
                )
              }
              return (
                <>
                  <Link href={data.forum_url}><Text strong >{data.forum_name}</Text></Link>
                  <Text type="secondary">({data.web_name})</Text>
                </>
              )
            } },
            {
              title: "Total", render: (data) => {
                if (data.null) {
                  return (
                    <Text>_ _ _</Text>
                  )
                }
                return <Text strong>{data.total}</Text>
              }
            }
          ]
        }
      />
    </Card>
  )
}

export default Statistic;