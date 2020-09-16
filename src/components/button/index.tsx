import styled from "@emotion/styled";

export const Button = styled.div`
  background: rgb(4, 174, 204);
  background: linear-gradient(
    45deg,
    rgba(4, 174, 204, 1) 5%,
    rgba(0, 63, 255, 1) 100%
  );
  display: inline-block;
  box-shadow: rgba(255, 255, 255, 0.3) 0 0 20px 0;
  cursor: pointer;
  line-height: 0;
  padding: 4px;
  border-radius: 8px;
  opacity: ${(props: any) => (props.disabled ? "0.3" : "1")};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;
