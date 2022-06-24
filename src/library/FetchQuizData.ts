import IQuestion from "./IQuestion";
import jsondata from '../data/quizes.json';
import { IQuizData } from "./Quiz";

export function fetchQuizes(): Promise<IQuizData> {
    return Promise.resolve(jsondata);
}