import styled from "styled-components";
import React from 'react';

interface CheckboxProps {
    id: number;
    label: string;
    onChange(index: number, isChecked: boolean): void;
    defaultChecked: boolean;
    index: number;
}

const CheckboxStyled = styled.input.attrs({
    type: "checkbox",
})``;

const CheckboxContainerStyled = styled.div`
    padding: 8px;
    width: 100%;
`;

const CheckboxLabelStyled = styled.label`
    padding: 8px;
`;

export default class Checkbox extends React.Component<CheckboxProps, {isChecked: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {isChecked: props.defaultChecked};
    }

    onChangeHandler() {
        const {
            index,
            onChange
        } = this.props;

        const isChecked = !this.state.isChecked;
        onChange(index, isChecked);
        this.setState({isChecked})
    }

    render() {
        const {
            id,
            label,
            index,
            
        } = this.props;
        const {isChecked} = this.state;

        return (
            <CheckboxContainerStyled
                tabIndex={0}
                onClick={(e) => {
                    this.onChangeHandler();
                }}  
                onKeyUp={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") {
                        return;
                    }
                    this.onChangeHandler();
                }}
                key={index}
            >
                <CheckboxStyled
                    id={`${id}`}
                    name={`${id}`}
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