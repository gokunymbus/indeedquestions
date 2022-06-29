import styled from 'styled-components';
import React from 'react';

interface CheckboxProps {
    id: number;
    name: string;
    label: string;
    onChange(index: number, isChecked: boolean): void;
    defaultChecked: boolean;
}

export const CheckboxStyled = styled.input.attrs({
    type: 'checkbox',
})`
    appearance: none;
    min-width: 30px;
    min-height: 30px;
    background-color: ${props => props.theme.primaryColor};
    position: relative;

    &:checked {
        &::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: ${props => props.theme.quinaryColor};
            z-index: 20;
            width: 20px;
            height: 20px;
        }
    }

    &:hover {
        cursor: pointer;
    }

`;

export const CheckboxContainerStyled = styled.div`
    padding: 8px;
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`;

export const CheckboxLabelStyled = styled.label`
    padding: 8px;
    font-family: ${props => props.theme.mainFont};
    font-size: 20px;
    color: ${props => props.theme.secondaryColor};

    &:hover {
        cursor: pointer;
    }
`;

export default class Checkbox extends React.Component<
    CheckboxProps, {isChecked: boolean}
> {
    constructor(props: any) {
        super(props);
        this.state = {isChecked: props.defaultChecked};
    }

    onChangeHandler() {
        const {
            onChange,
            id
        } = this.props;

        const isChecked = !this.state.isChecked;
        onChange(id, isChecked);
        this.setState({isChecked})
    }

    render() {
        const {
            id,
            label,
            name
        } = this.props;
        const {isChecked} = this.state;

        return (
            <CheckboxContainerStyled
                tabIndex={0}
                onClick={(e) => {
                    this.onChangeHandler();
                }}  
                onKeyUp={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') {
                        return;
                    }
                    this.onChangeHandler();
                }}
            >
                <CheckboxStyled
                    id={`${id}`}
                    name={`${name}`}
                    tabIndex={-1}
                    onChange={() => {}}
                    checked={isChecked}
                />
                <CheckboxLabelStyled
                    htmlFor={`${id}`}
                    onClick={(e) => {e.preventDefault()}}
                >
                    {label}
                </CheckboxLabelStyled>
            </CheckboxContainerStyled>
        )
    }
}