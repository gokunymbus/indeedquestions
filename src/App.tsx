/** @jsxImportSource @emotion/react */
import { ReactComponent as Logo } from "./IndeedLogo.svg";
import React from 'react';
import {getLanguageCode, getLanguageData} from './language/language';
import Home from "./views/Home";
import Question from "./views/Question";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import Quiz, { IQuiz, IQuizData } from './library/Quiz';
import IQuestion from "./library/IQuestion";
import { fetchQuizes } from "./library/FetchQuizData";
import Loading from "./views/Loading";

// Data
const languageData = getLanguageData();

const GlobalStyle = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
`;

const AppStyled = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface AppState {
  isQuizDataLoaded: boolean;
}

export default class App extends React.Component<any, AppState> {
  private _quiz: IQuiz | undefined;
  constructor(props: any) {
    super(props);
    this.state = {
      isQuizDataLoaded: false
    }
  }

  onNext = () => {

  };

  onStart = () => {
    
  };

  renderHome() {

  };

  componentDidMount() {
    const responsePromise = fetchQuizes();
    responsePromise.then((quizData) => {
      this._quiz = new Quiz(quizData);
      this.setState({
        isQuizDataLoaded: true
      });
    
      console.log(this._quiz);
    })
  }

  componentDidUpdate(prevProps: any, prevState: AppState) {
    console.log("AYY")
  }
  
  renderLoading() {
    return(<Loading />)
  }

  renderQuiz = () => {
    const languageCode = getLanguageCode();
    return (
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onStart={this.onStart}
                language={languageData}
                linkTo={`/question/${this._quiz?.getFirstQuestionID()}`}
              />
            }
          />

          <Route
            path="/question/:questionID"
            element={
              <Question
                onNext={this.onNext}
                language={languageData}
                languageCode={languageCode}
                quiz={this._quiz}
              />
            }
          />
        </Routes>
      </HashRouter>
    )
  }

  render() {
    const {isQuizDataLoaded} = this.state;
    return (
        <AppStyled>
          <GlobalStyle />
          {(isQuizDataLoaded)
            ?
              this.renderQuiz()
                :
              this.renderLoading()
          }
        </AppStyled>
    );
  }
}
