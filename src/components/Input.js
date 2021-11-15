import React from 'react';
import styled from 'styled-components';

export const TextInput = styled.input`
    box-sizing: border-box;
    border:1px solid #707070;
    padding:1rem;
    resize:none;
    &:focus{
        outline:1px solid ${({ theme }) => theme.colors.primary};
        box-shadow:0px 0px 10px ${({ theme }) => theme.colors.primary};
    }
`;