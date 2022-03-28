import { useCallback, useRef, useState } from "react";

function Copyable({ children }) {
  const [copyDone, setCopyDone] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        setCopyDone(true);
      })
      .finally(() => {
        setTimeout(() => setCopyDone(false), 2000);
      });
  }, []);

  return (
    <p className="copy">
      <span>{children}</span>
      <button onClick={copy}>
        {copyDone ? (
          <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
            />
          </svg>
        ) : (
          <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
            />
          </svg>
        )}
      </button>
    </p>
  );
}

export default Copyable;
