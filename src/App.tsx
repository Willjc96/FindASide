import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/games/*' component={GamePage} />
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  );
}

export default App;
