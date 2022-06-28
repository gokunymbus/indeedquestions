import { render } from "react-dom";
import React from 'react';
import App from "./App";

const rootElement = document.getElementById("root");
render(<React.StrictMode><App /></React.StrictMode>, rootElement);
