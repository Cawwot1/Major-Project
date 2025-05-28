//APP -> react app screen

//Import CSS file
import './styles/main.css';

//Import components
import Header from './components/Header';
import MainContent from './components/HomeContent';

export default function App() {
    return (
      <div>
        <Header />
        <MainContent />
      </div>
    );
  }
  