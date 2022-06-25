import styled from "styled-components";
import React from 'react';

interface ISelectionCheckbox {
    onClick: () => void;
    children: React.ReactNode;
    label: string;
}

const SelectionItemStyled = styled.div`
    padding: 8px;
    width: 100%;
`

const SelectionCheckboxStyled = styled.input`
    
`
export function SelectionCheckbox(props: ISelectionCheckbox) {
    const {onClick, children} = props;
    return  (
        <SelectionItemStyled
            onClick={onClick}
        >
            <SelectionCheckboxStyled type="checkbox" />
        </SelectionItemStyled>
    )
}