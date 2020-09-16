import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";

const StyledInput = styled.input`
  border: 0;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 1px 2px 3px -1px rgba(0, 0, 0, 0.15);
  background-color: #7373731a;
  font-size: 14px;
  width: 100%;
`;

const Input: FC<any> = ({
  onChange,
  type,
  disabled = false,
  value = "",
  dataTest,
}: any) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <StyledInput
      data-testid={dataTest}
      placeholder="0.00"
      value={input}
      disabled={disabled}
      onChange={(event) => {
        const val = event.target.value;
        if (type === "currency") {
          if (!val.match(/^[0-9]*\.?[0-9]{0,2}$/)) return;
        }
        setInput(val);
        if (onChange) onChange(val);
      }}
    />
  );
};

export default Input;
