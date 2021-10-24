import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css"

import AccountManage from "./components/account";
import PostCreate from "./components/post";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/account/manage">
            <AccountManage />
          </Route>
          <Route path="/web/manage">
            
          </Route>
          <Route path="/post">
            <PostCreate />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
