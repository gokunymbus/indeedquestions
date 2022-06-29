import React from 'react';
import {
    getLanguageCode,
    getLanguageData,
    languageObject
} from './language/language';
import Home from './views/Home';
import styled from 'styled-components';
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';
import {
  IQuizData,
  IAnsweredQuestion,
  getQuizResult
} from './library/QuizModel';
import { fetchQuizes } from './library/QuizData';
import Loading from './views/Loading';
import AppRoutes from './library/AppRoutes';
import Quiz from './views/Quiz';
import Completed from './views/Completed';
import { setQuizResults } from './library/QuizStorage';
import main from './themes/main.json';
import { PrimaryLink, SecondaryLink } from './components/Buttons';

const languageData: languageObject = getLanguageData();

const GlobalStyle = createGlobalStyle`
    body, html, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}
`;

const AppStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface AppState {
    quiz?: IQuizData;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
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
            <PrimaryLink to={AppRoutes.home}>
                {backToStart}
            </PrimaryLink>
        )
    }

    renderPlayAgainButton() {
        const {
            playAgainButton
        } = languageData;
        return (
            <SecondaryLink to={AppRoutes.question}>
                {playAgainButton}
            </SecondaryLink>
        )
    }

    renderCompleteQuizButton() {
        const {
            completeQuizButton
        } = languageData;
        return (
            <PrimaryLink to={AppRoutes.complete}>
                {completeQuizButton}
            </PrimaryLink>
        )
    }

    renderQuiz() {
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
                    peppers={20}
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
                <ThemeProvider theme={main}>
                    <GlobalStyle />
                    {(quiz)
                        ? this.renderQuiz()
                        : this.renderLoading()
                    }
                </ThemeProvider>
            </AppStyled>
        );
    }
}

export default App;