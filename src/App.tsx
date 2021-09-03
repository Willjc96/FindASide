import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import HomePage from './Pages/Homepage';
import GamePage from './Pages/GamePage';
import Header from './Components/Header';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import 'semantic-ui-css/semantic.min.css';
import { UserContextProvider } from './Context/UserContext';
import LobbyPage from './Pages/LobbyPage';
import MyAccount from './Pages/MyAccount';
import Footer from './Components/Footer'

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/games/*' component={GamePage} />
          <Route path='/login' component={LoginPage} />
          <Route path='/signup' component={SignupPage} />
          <Route path='/lobby/:gameId/:lobbyId' component={LobbyPage} />
          <Route path='/myaccount' component={MyAccount} />
          <Redirect from='*' to='/' />
        </Switch>
        <Footer />
      </Router>
    </UserContextProvider>
  );
}

export default App;
