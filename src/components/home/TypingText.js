"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = [
  "Games",
  "Systems",
  "Experiences",
  "Tools",
  "Solutions",
  "Performance",
];

export default function TypingText() {
  const [text, setText] = useState("Games");
  const stateRef = useRef({
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
  });

  useEffect(() => {
    let timeoutId;
    let active = true;

    const type = () => {
      if (!active) return;

      const state = stateRef.current;
      const currentWord = WORDS[state.wordIndex];
      let typingSpeed = 100;

      if (state.isDeleting) {
        state.charIndex -= 1;
        setText(currentWord.substring(0, state.charIndex));
        typingSpeed = 50;
      } else {
        state.charIndex += 1;
        setText(currentWord.substring(0, state.charIndex));
        typingSpeed = 100;
      }

      if (!state.isDeleting && state.charIndex === currentWord.length) {
        typingSpeed = 2000;
        state.isDeleting = true;
      } else if (state.isDeleting && state.charIndex === 0) {
        state.isDeleting = false;
        state.wordIndex = (state.wordIndex + 1) % WORDS.length;
        typingSpeed = 500;
      }

      timeoutId = setTimeout(type, typingSpeed);
    };

    timeoutId = setTimeout(type, 1000);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <span id="typing-text" className="text-primary">
        {text}
      </span>
      <span className="text-primary typing-cursor">|</span>
    </>
  );
}
