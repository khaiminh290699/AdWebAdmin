import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css"

import AccountManage from "./components/account";
import PostCreate from "./components/post";
import PostTimer from "./components/post-timer";
import Progressing from "./components/progressing";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/account/manage">
            <AccountManage />
          </Route>
          <Route path="/post/timer">
            <PostTimer />
          </Route>
          <Route path="/post/create">
            <PostCreate />
          </Route>
          <Route path="/progressing/:id">
            <Progressing />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
