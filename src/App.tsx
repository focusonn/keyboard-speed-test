import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface TestResult {
  wpm: number;
  accuracy: number;
  time: string;
  difficulty: string;
  date: string;
}

interface DifficultyLevel {
  name: string;
  textLength: number;
}

const difficultyLevels: { [key: string]: DifficultyLevel } = {
  easy: {
    name: 'Easy',
    textLength: 100
  },
  medium: {
    name: 'Medium',
    textLength: 200
  },
  hard: {
    name: 'Hard',
    textLength: 300
  }
};

const sampleTexts: string[] = [
  "The quick brown fox jumps over the lazy dog.",
  "Technology is constantly evolving and new programming languages are emerging.",
  "Speed and accuracy are very important in the software development process.",
  "JavaScript is the cornerstone of modern web applications.",
  "Open source projects contribute greatly to the development of the software world.",
  "Artificial intelligence and machine learning technologies are developing rapidly today.",
  "User experience is very important in web design.",
  "Database management is one of the basic requirements of modern applications.",
  "Developing modern web applications with React library is very easy.",
  "TypeScript adds type safety to JavaScript and is very useful in large projects.",
  "With Node.js you can develop powerful applications using JavaScript on the server side.",
  "Creating responsive designs with CSS Grid and Flexbox is now much easier.",
  "Git version control system is an indispensable part of the software development process.",
  "Technologies like RESTful principles and GraphQL are used in API design.",
  "React Native and Flutter are popular choices in mobile application development.",
  "Python programming language is very popular in data science and artificial intelligence.",
  "Docker container technology facilitates application deployment.",
  "Kubernetes is used for managing large-scale applications.",
  "MongoDB NoSQL database offers flexible data structures.",
  "PostgreSQL is a powerful and open source relational database.",
  "Redis is used as an in-memory data structure store.",
  "Elasticsearch searches and analyzes large data sets.",
  "Apache Kafka is a real-time data streaming platform.",
  "AWS is the leader in cloud computing services.",
  "Azure is Microsoft's cloud computing platform.",
  "Google Cloud Platform offers powerful cloud services.",
  "Serverless architecture increases application scalability.",
  "Microservices architecture divides large applications into small pieces.",
  "DevOps brings together development and operations teams.",
  "CI/CD automates continuous integration and deployment processes."
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (currentPage === 'test') {
      generateNewText();
    }
  }, [currentPage, difficulty]);

  const generateNewText = (): void => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const maxLength = difficultyLevels[difficulty].textLength;
    
    let trimmedText = randomText;
    
    if (randomText.length > maxLength) {
      const words = randomText.split(' ');
      let result = '';
      
      for (const word of words) {
        if ((result + ' ' + word).length <= maxLength) {
          result += (result ? ' ' : '') + word;
        } else {
          break;
        }
      }
      
      trimmedText = result || randomText.substring(0, maxLength);
    }
    
    setCurrentText(trimmedText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
  };

  const handleKeyPress = (e: KeyboardEvent): void => {
    if (currentPage !== 'test' || endTime) return;
    
    e.preventDefault();
    
    if (e.key === 'Escape') {
      resetTest();
      return;
    }
    
    if (e.key === 'Backspace') {
      if (userInput.length > 0) {
        const newValue = userInput.slice(0, -1);
        setUserInput(newValue);
        setCurrentIndex(newValue.length);
        
        let correctChars = 0;
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] === currentText[i]) {
            correctChars++;
          }
        }
        const accuracyPercent = newValue.length > 0 ? (correctChars / newValue.length) * 100 : 100;
        setAccuracy(Math.round(accuracyPercent));
      }
      return;
    }
    
    if (e.key.length === 1) {
      const newValue = userInput + e.key;
      
      if (!startTime) {
        setStartTime(Date.now());
        setIsActive(true);
      }

      setUserInput(newValue);
      setCurrentIndex(newValue.length);

      let correctChars = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] === currentText[i]) {
          correctChars++;
        }
      }
      const accuracyPercent = newValue.length > 0 ? (correctChars / newValue.length) * 100 : 100;
      setAccuracy(Math.round(accuracyPercent));

      if (newValue === currentText) {
        const endTime = Date.now();
        setEndTime(endTime);
        setIsActive(false);
        
        const timeInMinutes = (endTime - startTime!) / 60000;
        const wordsTyped = currentText.split(' ').length;
        const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
        setWpm(calculatedWpm);

        const testResult: TestResult = {
          wpm: calculatedWpm,
          accuracy: Math.round(accuracyPercent),
          time: ((endTime - startTime!) / 1000).toFixed(1),
          difficulty: difficulty,
          date: new Date().toLocaleDateString('en-US')
        };
        setTestHistory(prev => [testResult, ...prev.slice(0, 9)]);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, userInput, currentText, startTime, endTime]);

  const resetTest = (): void => {
    generateNewText();
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = '';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'correct' : 'incorrect';
      } else if (index === currentIndex) {
        className = 'current';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const renderNavbar = () => (
    <nav className="floating-navbar">
      <div className="nav-brand">
        <span>Keyboard SpeedTest</span>
      </div>
      <div className="nav-links">
        <button 
          className={currentPage === 'home' ? 'active' : ''} 
          onClick={() => setCurrentPage('home')}
          title="Home"
        >
          Home
        </button>
        <button 
          className={currentPage === 'test' ? 'active' : ''} 
          onClick={() => setCurrentPage('test')}
          title="Typing Test"
        >
          Test
        </button>
        <button 
          className={currentPage === 'stats' ? 'active' : ''} 
          onClick={() => setCurrentPage('stats')}
          title="Statistics"
        >
          Stats
        </button>
        <button 
          className={currentPage === 'settings' ? 'active' : ''} 
          onClick={() => setCurrentPage('settings')}
          title="Settings"
        >
          Settings
        </button>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Keyboard SpeedTest</h1>
        <p>Test and improve your typing speed with our modern typing test application</p>
        <button 
          onClick={() => setCurrentPage('test')} 
          className="start-test-btn"
        >
          Start Typing Test
        </button>
      </div>
    </div>
  );

  const renderTestPage = () => (
    <div className="test-page">
      <div className="test-header">
        <h2>Typing Speed Test</h2>
        <div className="difficulty-selector">
          {Object.entries(difficultyLevels).map(([key, level]) => (
            <button
              key={key}
              className={difficulty === key ? 'active' : ''}
              onClick={() => setDifficulty(key)}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span className="stat-value">
            {!isActive && !endTime && 'Ready'}
            {isActive && 'Typing...'}
            {endTime && 'Completed!'}
          </span>
        </div>
      </div>

      <div className="text-display">
        {renderText()}
      </div>

      <div className="controls">
        <button onClick={resetTest} className="reset-btn">
          New Test (ESC)
        </button>
      </div>

      {endTime && (
        <div className="results-modal">
          <div className="results-content">
            <h2>Test Completed!</h2>
            <div className="result-stats">
              <div className="result-item">
                <span className="stat-label">Speed</span>
                <span className="stat-value">{wpm} WPM</span>
              </div>
              <div className="result-item">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
              <div className="result-item">
                <span className="stat-label">Time</span>
                <span className="stat-value">{((endTime - startTime!) / 1000).toFixed(1)}s</span>
              </div>
            </div>
            <button onClick={resetTest} className="try-again-btn">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStatsPage = () => (
    <div className="stats-page">
      <h2>Your Statistics</h2>
      {testHistory.length === 0 ? (
        <div className="no-stats">
          <p>No test history found</p>
          <button onClick={() => setCurrentPage('test')} className="start-test-btn">
            Take Your First Test
          </button>
        </div>
      ) : (
        <div className="stats-content">
          <div className="stats-summary">
            <div className="summary-card">
              <h3>Average Speed</h3>
              <span className="summary-value">
                {Math.round(testHistory.reduce((sum, test) => sum + test.wpm, 0) / testHistory.length)} WPM
              </span>
            </div>
            <div className="summary-card">
              <h3>Average Accuracy</h3>
              <span className="summary-value">
                {Math.round(testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length)}%
              </span>
            </div>
            <div className="summary-card">
              <h3>Total Tests</h3>
              <span className="summary-value">{testHistory.length}</span>
            </div>
          </div>
          
          <div className="history-table">
            <h3>Recent Tests</h3>
            <div className="table-header">
              <span>Date</span>
              <span>Speed</span>
              <span>Accuracy</span>
              <span>Time</span>
              <span>Difficulty</span>
            </div>
            {testHistory.map((test, index) => (
              <div key={index} className="table-row">
                <span>{test.date}</span>
                <span>{test.wpm} WPM</span>
                <span>{test.accuracy}%</span>
                <span>{test.time}s</span>
                <span>{difficultyLevels[test.difficulty].name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSettingsPage = () => (
    <div className="settings-page">
      <h2>Settings</h2>
      <div className="settings-content">
        <div className="setting-group">
          <h3>Default Difficulty</h3>
          <div className="difficulty-options">
            {Object.entries(difficultyLevels).map(([key, level]) => (
              <button
                key={key}
                className={difficulty === key ? 'active' : ''}
                onClick={() => setDifficulty(key)}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Data</h3>
          <button 
            className="clear-data-btn"
            onClick={() => setTestHistory([])}
          >
            Clear Test History
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {renderNavbar()}
      
      <main className="main-content">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'test' && renderTestPage()}
        {currentPage === 'stats' && renderStatsPage()}
        {currentPage === 'settings' && renderSettingsPage()}
      </main>
    </div>
  );
}

export default App;