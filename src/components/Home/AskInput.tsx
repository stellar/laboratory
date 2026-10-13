import { useState } from "react";
import { Button, Icon } from "@stellar/design-system";

import { NEEVAI_MAX_MESSAGE_LENGTH } from "@/constants/settings";
import { askNeevai } from "@/helpers/askNeevai";

/**
 * Homepage "What are you building?" chat field (full width, with the Ask
 * button inside the field). Sends the question to the NeevAI
 * chat widget.
 *
 * The value is local `useState` on purpose: it is a transient draft that should
 * not sync to the URL through Zustand.
 */
export const AskInput = () => {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) {
      return;
    }

    askNeevai(question);
    setQuestion("");
  };

  return (
    <form
      className="Lab__home__ask"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <textarea
        id="home-ask-input"
        className="Lab__home__ask__input"
        aria-label="What are you building?"
        placeholder="What are you building?"
        rows={2}
        maxLength={NEEVAI_MAX_MESSAGE_LENGTH}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
          }
        }}
      />

      <div className="Lab__home__ask__footer">
        <Button
          size="md"
          variant="tertiary"
          type="submit"
          icon={<Icon.ArrowRight />}
          iconPosition="right"
          disabled={!question.trim()}
        >
          Start
        </Button>
      </div>
    </form>
  );
};
