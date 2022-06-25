import styled from "styled-components";
import React from 'react';

interface RadioButtonProps {
    id: number;
    label: string;
    groupName?: string;
    onChange(index: number): void;
    checked: boolean;
    index: number;
}

const RadioButtonStyled = styled.input.attrs({
    type: "radio",
})`

`;

const RadioContainerStyled = styled.div`
    padding: 8px;
    width: 100%;
`;

const RadioLabelStyled = styled.label`
    padding: 8px;
`;

class RadioButton extends React.Component<RadioButtonProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {
            id,
            label,
            groupName,
            index,
            onChange,
            checked
        } = this.props;

        return (
            <RadioContainerStyled
                tabIndex={0}
                onClick={(e) => {
                    onChange(index);
                }}  
                onKeyUp={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") {
                        return;
                    }
                    onChange(index);
                }}
            >
                <RadioButtonStyled
                    id={`${id}`}
                    name={`${groupName}`}
                    tabIndex={-1}
                    checked={checked}
                    defaultChecked={false}
                />
                <RadioLabelStyled
                    htmlFor={`${id}`}
                >
                    {label}
                </RadioLabelStyled>
            </RadioContainerStyled>
        )
    }
}

export interface IRadioGroupItem {
    label: string;
    id: number;
    data: any;
}

export interface IRadioGroupProps {
    items: IRadioGroupItem[];
    onChange(id: number, data: object): void;
    groupName: string;
}

const RadioGroupStyled = styled.div`
    padding: 8px;
    width: 100%;
`;

export class RadioGroup extends React.Component<IRadioGroupProps, {activeIndex: number}> {
    constructor(props: IRadioGroupProps) {
        super(props);
        this.state = {activeIndex: 0};
    }

    onChangeHandler = (index: number) => {
        this.setState({activeIndex: index})
    }

    render() {
        const {items} = this.props;
        return  (
            <RadioGroupStyled>
                {items.map((item, index) =>
                    <RadioButton
                        {...item}
                        onChange={this.onChangeHandler}
                        index={index}
                        checked={index === this.state.activeIndex}
                    />
                )}
            </RadioGroupStyled>
        )
    }
}