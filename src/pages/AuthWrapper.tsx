import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}
const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Wrapper>
        <h1>Loading...</h1>
      </Wrapper>
    );
  }
  if (error) {
    return (
      <Wrapper>
        <h1>{error.message}</h1>
      </Wrapper>
    );
  }
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

export default AuthWrapper;
