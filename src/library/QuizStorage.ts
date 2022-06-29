import {
    IQuizResult,
} from './QuizModel';

const storageKey = 'quiz-storage';

export function setQuizResults(quizResult: IQuizResult) {
    const allQuizResults: IQuizResult[] = [quizResult];
    const existingQuizResults: string | null = localStorage.getItem(storageKey);
    if (!existingQuizResults) {
        localStorage.setItem(storageKey, JSON.stringify(allQuizResults));
        return;
    }

    const formatedResults = JSON.parse(existingQuizResults!);
    const finalQuizResult = allQuizResults.concat(formatedResults);
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
        return (aResult.correctQuestions > bResult.correctQuestions) ? -1 : 1;
    })
}