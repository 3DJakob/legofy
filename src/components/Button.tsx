import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 10px;
  background-color: rgb(111, 200, 220);
  border-radius: 8px;
  color: #fff;
  display: flex;
  flex: 0;
  transition: 200ms;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-weight: bold;

  :hover {
    background-color: rgb(131, 220, 240);
  }
`

export interface ButtonProps {
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <Container onClick={onClick}>
      {children}
    </Container>
  )
}

export default Button
