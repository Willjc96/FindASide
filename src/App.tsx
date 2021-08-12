import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import Header from './Components/Header';
import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/games/*' component={GamePage} />
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  );
}

export default App;
