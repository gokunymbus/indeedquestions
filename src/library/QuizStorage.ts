import { IQuizData, IQuizResult, getScore, getCorrectQuestions } from "./QuizModel";

const storageKey = "quiz-storage";

export function setQuizResults(quiz: IQuizData) {
    const { questions } = quiz;
    const quizResult: IQuizResult[] = [];
    const existingQuizResults: string | null = localStorage.getItem(storageKey);
    const newQuiz = {
        dateCompleted: new Date().toString(),
        points: getScore(questions),
        totalQuestions: questions.length,
        correctQuestions: getCorrectQuestions(questions)
    };

    quizResult.push(newQuiz);

    if (!existingQuizResults) {
        localStorage.setItem(storageKey, JSON.stringify(quizResult));
        return;
    }

    const formatedResults = JSON.parse(existingQuizResults!);
    const finalQuizResult = quizResult.concat(formatedResults);
    localStorage.setItem(storageKey, JSON.stringify(finalQuizResult));
}

export function getQuizResults(): IQuizResult[] | null {
    const existingQuizResults: string | null = localStorage.getItem(storageKey);
    if (existingQuizResults) {
        return JSON.parse(existingQuizResults);;
    }
    return null;
}

export function sortResultsByScore(results: IQuizResult[]): IQuizResult[] {
    const newResults = [...results];
    return newResults.sort((aResult, bResult) => {
        return (aResult.correctQuestions > bResult.correctQuestions) ? 1 : -1;
    })
}