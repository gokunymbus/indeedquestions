import styled from "styled-components";
import React from 'react';

interface CheckboxProps {
    id: number;
    name: string;
    label: string;
    onChange(index: number, isChecked: boolean): void;
    defaultChecked: boolean;
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
                    if (e.key !== "Enter" && e.key !== " ") {
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