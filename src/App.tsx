/** @jsxImportSource @emotion/react */
import React from 'react';
import {getLanguageCode, getLanguageData} from './language/language';
import Home from "./views/Home";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { IQuizData } from './library/QuizModel';
import IQuestion from "./library/IQuestion";
import { fetchQuizes } from "./library/QuizData";
import Loading from "./views/Loading";
import AppRoutes from './library/AppRoutes';
import Quiz from './views/Quiz';
import useWithNavigate from './library/useWithNavigate';

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
  quiz?: IQuizData;
}

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {}
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
      this.setState({
        quiz: quizData
      });
    })
  }
  
  renderLoading() {
    return(<Loading />)
  }

  renderQuiz = () => {
    const languageCode = getLanguageCode();
    const {quiz} = this.state;
    return (
      <HashRouter>
        <Routes>
          <Route
            path={AppRoutes.home}
            element={
              <Home
                onStart={this.onStart}
                language={languageData}
                linkTo={`${AppRoutes.question}`}
              />
            }
          />
          <Route
            path={`${AppRoutes.question}`}
            element={
              <Quiz
                language={languageData}
                languageCode={languageCode}
                data={quiz}
                onComplete={(questions: IQuestion[]) => {
                  const { navigate } = this.props;
                  navigate('/complete');
                }}
              />
            }
          />
          <Route
            path={`${AppRoutes.complete}`}
            element={
            <div>
              Quiz Completed
            </div>}
          />
        </Routes>
      </HashRouter>
    )
  }

  render() {
    const {quiz} = this.state;
    return (
        <AppStyled>
          <GlobalStyle />
          {(quiz)
            ?
              this.renderQuiz()
                :
              this.renderLoading()
          }
        </AppStyled>
    );
  }
}

export default useWithNavigate(App);