import { css } from "@emotion/react";
import { useState } from "react";
import StyledInput from "../components/StyledInput";

export default function FirstPage() {
  const [value, setValue] = useState("");
  return (
    <div style={{ margin: "100px" }}>
      {/* <StyledInput
        label="Teste"
        value={value}
        onChange={(vle) => setValue(vle.target.value)}
      /> */}
    </div>
  );
}
