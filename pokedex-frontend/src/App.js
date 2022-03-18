import React, { useState } from 'react';
import PokemonList from './components/PokemonList';
import DarkModeFooter from './layouts/DarkModeFooter';
import './styles.css';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const themesStyles = {
  light: {
    foreground: "rgba(66, 140, 224, 0.918)",
    background: "rgba(66, 140, 224, 0.918)",
    text: "#000000",
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222",
    text: '#a0aec0',
  }
};
const THEMES = {
  DARK: 'Dark Mode',
  LIGHT: 'Light Mode'
}

export const ThemeContext = React.createContext(THEMES.DARK);

function App() {
  const [appThemes, setAppThemes] = useState(prefersDark ? THEMES.DARK : THEMES.LIGHT);

  const handleClick = (event) => {
    setAppThemes(event.target.checked
      ? THEMES.DARK
      : THEMES.LIGHT);
  };

  return (
    <div className="App">
      <div className="theme-toggle-button">
        <DarkModeFooter
          displayMode={appThemes}
          toggleOptions={[THEMES.DARK, THEMES.LIGHT]}
          handleDisplayModeChange={handleClick}/>
      </div>
      <div className="app-pokidex-list">
        <ThemeContext.Provider value={appThemes === THEMES.DARK ? themesStyles.dark : themesStyles.light}>
          <PokemonList/>
        </ThemeContext.Provider>
      </div>
    </div>
  );
}

export default App;
