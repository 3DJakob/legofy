import React from 'react'
import styled from 'styled-components'

const Element = styled.h1`
  
`

const Title: React.FC = ({ children }) => {
  return (
    <Element>
      {children}
    </Element>
  )
}

export default Title
