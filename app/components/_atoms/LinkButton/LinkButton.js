'use client';
import styled from 'styled-components';
import Link from 'next/link';

const Wrapper = styled.div`
  background: rgb(43, 131, 232);
  color: white;
  height: 2rem;
  width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  &:hover {
    background: rgb(24, 93, 158);
  }
`;

export default function LinkButton({ text, href }) {
  return (
    <Wrapper>
      <StyledLink href={href}>{text}</StyledLink>
    </Wrapper>
  );
}
