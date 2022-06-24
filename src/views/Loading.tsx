import { ReactNode } from 'react';
import React from 'react';

export default class Loading extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render(): ReactNode {
        return  (
            <div>
               Loading...
            </div>
        )
    }
}