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
})``;

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

    onChangeHandler() {
        const {
            index,
            onChange,
            checked
        } = this.props;

        if (!checked) {
            onChange(index);
        }
    }

    render() {
        const {
            id,
            label,
            groupName,
            checked,
            index
        } = this.props;
        return (
            <RadioContainerStyled
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
                <RadioButtonStyled
                    id={`${id}`}
                    name={`${groupName}`}
                    tabIndex={-1}
                    onChange={() => {}}
                    checked={checked}
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
    onChange(index: number): void;
    groupName: string;
    selectedIndex?: number;
}

export class RadioGroup extends React.Component<IRadioGroupProps, {activeIndex: number}> {
    constructor(props: IRadioGroupProps) {
        super(props);
        if (props.selectedIndex) {
            this.state = {activeIndex: props.selectedIndex}
        }
        this.state = {activeIndex: -1}; // D
    }

    onChangeHandler = (index: number) => {
        const {onChange} = this.props;
        this.setState({activeIndex: index})
        onChange(index);
    }

    render() {
        const {items} = this.props;
        return items.map((item, index) =>
            <RadioButton
                {...item}
                onChange={this.onChangeHandler}
                index={index}
                checked={index === this.state.activeIndex}
                key={index}
            />
        )
        
    }
}