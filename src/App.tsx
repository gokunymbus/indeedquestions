import React from 'react';
import {getLanguageCode, getLanguageData} from './language/language';
import Home from "./views/Home";
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import {
  HashRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {
  IQuizData,
  IQuestion,
  IAnsweredQuestion,
  getQuizResult
} from './library/QuizModel';
import { fetchQuizes } from "./library/QuizData";
import Loading from "./views/Loading";
import AppRoutes from './library/AppRoutes';
import Quiz from './views/Quiz';
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

  renderPlayAgainButton() {
    const {
      playAgainButton
    } = languageData;
    return (
        <Link to={AppRoutes.question}>
          <BigButton onClick={() => {}}>
              {playAgainButton}
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
                onComplete={(answeredQuestions: IAnsweredQuestion[]) => {
                  setQuizResults(
                    getQuizResult({
                      ...quiz!,
                      answeredQuestions: [...answeredQuestions]
                    })
                  );
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
                renderPlayAgain={this.renderPlayAgainButton()}
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