import styled from 'styled-components';
import React from 'react';

interface RadioButtonProps {
    id: number;
    label: string;
    groupName?: string;
    onChange(index: number): void;
    checked: boolean;
    index: number;
}

export const RadioButtonStyled = styled.input.attrs({
    type: 'radio',
})`
    appearance: none;
    min-width: 30px;
    min-height: 30px;
    background-color: ${props => props.theme.primaryColor};
    border-radius: 50%;
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
            border-radius: 50%;
        }
    }

    &:hover {
        cursor: pointer;
    }
`;

export const RadioContainerStyled = styled.div`
    padding: 8px;
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`;

export const RadioLabelStyled = styled.label`
    padding: 8px;
    font-family: ${props => props.theme.mainFont};
    font-size: 20px;
    color: ${props => props.theme.secondaryColor};

    &:hover {
        cursor: pointer;
    }
`;

class RadioButton extends React.Component<RadioButtonProps, {}> {
    constructor(props: RadioButtonProps) {
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
            checked
        } = this.props;
        return (
            <RadioContainerStyled
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