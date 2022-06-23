/** @jsxImportSource @emotion/react */
import { ReactComponent as Logo } from "./IndeedLogo.svg";
import React from 'react';
import {getLanguageData, getLanguageCode} from './language/language';

const languageData = getLanguageData();\

export default function App() {
  return (
    <LanguageContext.Provider>
      <div css={{ padding: "0 16px" }}>
        
      </div>
    </LanguageContext.Provider>
  );
}
