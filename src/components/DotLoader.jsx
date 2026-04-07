import { useEffect, useState } from "react";

export default function DotLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((previous) => (previous.length >= 3 ? "" : previous + "."));
    }, 400);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{dots}</span>;
}
