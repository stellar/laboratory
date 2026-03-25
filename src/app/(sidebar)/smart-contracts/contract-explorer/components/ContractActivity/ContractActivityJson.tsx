"use client";

import { useState } from "react";
import { Icon } from "@stellar/design-system";

import { CodeEditor } from "@/components/CodeEditor";

/**
 * Collapsible JSON viewer for a single contract event.
 * Collapsed by default, toggled via "View JSON" link.
 *
 * @example
 * <ContractActivityJson eventJson={JSON.stringify(event, null, 2)} />
 */
export const ContractActivityJson = ({
  eventJson,
}: {
  eventJson: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ContractActivity__json">
      <button
        className="ContractActivity__jsonToggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        View JSON{" "}
        {isExpanded ? (
          <Icon.ChevronUp />
        ) : (
          <Icon.ChevronDown />
        )}
      </button>

      {isExpanded ? (
        <CodeEditor
          value={eventJson}
          selectedLanguage="json"
          isAutoHeight
          maxHeightInRem="30"
        />
      ) : null}
    </div>
  );
};
