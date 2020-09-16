import styled from "@emotion/styled";
import { ReactComponent as AcceptI } from "../../ico/accept.svg";

export const Wrapper = styled.div`
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

export const Column = styled.div`
  flex-grow: 1;
  flex-basis: 50%;
  &:first-of-type {
    padding-right: 4px;
  }
  &:last-child {
    padding-left: 4px;
  }
`;

export const CurrencySelector = styled.div`
  padding: 4px 0 8px;
  display: flex;
  justify-content: space-between;
`;

export const Rate = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

export const Footer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const AcceptIcon = styled(AcceptI)`
  fill: white;
  width: 25px;
  height: 25px;
`;

export const Balance = styled.span`
  font-size: 12px;
  opacity: 0.8;
  color: ${(props: any) => (props.overdraft ? "red" : "inherit")};
`;
