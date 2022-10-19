import AppHeader from "../appHeader/AppHeader";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {MainPage, ComicsPage} from '../pages'


const App =()=> {
  return (
  <Router>
    <div className="app">
      <AppHeader/>
      <main>
      <Switch>
        <Route path="/marvel-information-portal" exact>
          <MainPage/>
        </Route>
        <Route path="/marvel-information-portal/comics" exact>
          <ComicsPage/>
        </Route>
      </Switch>
      </main>
    </div>
  </Router>
  )
}

export default App;