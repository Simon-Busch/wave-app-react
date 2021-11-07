import './App.css';
import Messages from './components/Messages/messages/messages';
import MessagInput from './components/Messages/messageInput/messagInput';
import Button from './components/UI/Button/button';

const App = () => {
  return (
    <div className="App">
    <h1>Dare to Wave</h1>
      <MessagInput />
      <Button />
      <Messages />

    </div>
  );
}

export default App;
