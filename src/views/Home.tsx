import { ReactNode } from 'react';
import { BigButton } from '../components/Buttons';
import React from 'react';
import { Link } from "react-router-dom";

interface IHomeProps {
    language: any;
    linkTo: string;
}

export default class Home extends React.Component<IHomeProps, {}> {
    constructor(props: IHomeProps) {
        super(props);
    }

    render(): ReactNode {
        const {language, linkTo} = this.props;

        return  (
            <div>
                <Link to={linkTo}>
                    <BigButton onClick={() => {}}>{language.startButton}</BigButton>
                </Link>
            </div>
        )
    }
       
}