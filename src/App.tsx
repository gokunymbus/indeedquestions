/** @jsxImportSource @emotion/react */
import React from 'react';
import {getLanguageCode, getLanguageData} from './language/language';
import Home from "./views/Home";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { IQuizData } from './library/QuizModel';
import IQuestion from "./library/IQuestion";
import { fetchQuizes } from "./library/QuizData";
import Loading from "./views/Loading";
import AppRoutes from './library/AppRoutes';
import Quiz from './views/Quiz';
import useWithNavigate from './library/useWithNavigate';
import { BigButton } from './components/Buttons';
import Completed from './views/Completed';
import { setQuizResults } from './library/QuizStorage';

// Data
const languageData:any = getLanguageData();

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

  componentDidUpdate(prevProps:any, prevState: AppState) {
    console.log(prevProps, "APP");
    console.log(prevState, "APP");
    console.log(this.props, "APP");
    console.log(this.state, "APP");
  }

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

  renderBackToStartButton() {
    const {
        backToStart
    } = languageData;
    return (
        <Link to={AppRoutes.home}>
          <BigButton onClick={() => {}}>
              {backToStart}
          </BigButton>
        </Link>
    )
  }

  renderCompleteQuizButton() {
    const {
        completeQuizButton
    } = languageData;
      return (
        <Link to={AppRoutes.complete}>
          <BigButton onClick={() => {}}>
              {completeQuizButton}
          </BigButton>
        </Link>
      )
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
                  // Write completed questions to local storage.
                  const newQuiz: IQuizData = {
                    name: quiz?.name!,
                    id: quiz?.id!,
                    questions: [...questions]
                  }
                  setQuizResults(newQuiz);
                }}
                renderBackToStartButton={this.renderBackToStartButton()}
                renderCompleteButton={this.renderCompleteQuizButton()}
              />
            }
          />
          <Route
            path={`${AppRoutes.complete}`}
            element={
              <Completed
                language={languageData}
                languageCode={languageCode}
              />
            }
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

export default App;