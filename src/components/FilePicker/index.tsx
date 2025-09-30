import { useState, useRef, useEffect } from "react";
import { Icon } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { capitalizeString } from "@/helpers/capitalizeString";
import { formatFileSize } from "@/helpers/formatFileSize";

import "./styles.scss";

interface FilePickerProps {
  onChange: (file?: File) => void;
  acceptedExtension: string[];
  isDisabled?: boolean;
}

export const FilePicker = ({
  onChange,
  acceptedExtension,
  isDisabled,
}: FilePickerProps) => {
  const dropAreaElRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const [isDropInProgress, setIsDropInProgress] = useState(false);
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formatSelectedFileMessage = (file: File) => {
    const size = formatFileSize(file.size);

    return (
      <>
        <Icon.CheckCircle /> {`${file.name} (${size})`}
      </>
    );
  };

  useEffect(() => {
    const dropArea = dropAreaElRef?.current;

    const handleEnter = (event: Event) => {
      event.preventDefault();

      if (isDisabled) {
        setIsDropDisabled(true);
      } else {
        setIsDropInProgress(true);
        setErrorMessage("");
      }
    };

    const handleLeave = (event: Event) => {
      if (isDisabled) {
        setIsDropDisabled(false);
      } else {
        event.preventDefault();
        setIsDropInProgress(false);
      }
    };

    const handleDrop = (event: DragEvent) => {
      if (isDisabled) {
        return;
      }

      const files = event?.dataTransfer?.files;
      const droppedFile = files?.[0];
      const droppedFiledExtension = droppedFile?.name
        .toLowerCase()
        .split(".")
        .pop();

      onChange(undefined);
      setSelectedFile(undefined);

      if (files && files.length > 1) {
        setErrorMessage("Too many files. Please select only one file.");
        return;
      }

      if (droppedFile && droppedFiledExtension) {
        if (!acceptedExtension.includes(droppedFiledExtension)) {
          // Handling only the first extension for now
          setErrorMessage(
            `Invalid file type. Please select a ${capitalizeString(acceptedExtension[0])} file.`,
          );
          return;
        }

        onChange(droppedFile);
        setSelectedFile(droppedFile);
        setErrorMessage("");
      }
    };

    ["dragenter", "dragover"].forEach((evtName) => {
      dropArea?.addEventListener(evtName, handleEnter);
    });

    ["dragleave", "drop"].forEach((evtName) => {
      dropArea?.addEventListener(evtName, handleLeave);
    });

    dropArea?.addEventListener("drop", handleDrop);

    return () => {
      ["dragenter", "dragover"].forEach((evtName) => {
        dropArea?.removeEventListener(evtName, handleEnter);
      });

      ["dragleave", "drop"].forEach((evtName) => {
        dropArea?.removeEventListener(evtName, handleLeave);
      });

      dropArea?.removeEventListener("drop", handleDrop);
    };
  }, [acceptedExtension, isDisabled, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputFile = event.target?.files?.[0];

    onChange(inputFile);
    setSelectedFile(inputFile);
    setErrorMessage("");

    // We need to clear the previous file/value to make it work when the same
    // file is selected again. Without clearing, the browser is caching the
    // file, so it won’t change even if it’s updated and selected again.
    event.target.value = "";
  };

  const Message = ({
    type,
    children,
  }: {
    type: "info" | "success" | "error";
    children: React.ReactNode;
  }) => {
    const classes = ["FilePicker__message"];

    if (type === "success") {
      classes.push("FilePicker__message--success");
    }

    if (type === "error") {
      classes.push("FilePicker__message--error");
    }

    return (
      <Box
        gap="xs"
        direction="row"
        align="center"
        justify="center"
        addlClassName={classes.join(" ")}
      >
        {children}
      </Box>
    );
  };

  const containerClasses = [
    "FilePicker",
    ...(isDropInProgress ? ["FilePicker--active"] : []),
    ...(isDropDisabled ? ["FilePicker--disabled"] : []),
  ].join(" ");

  return (
    <div ref={dropAreaElRef} className={containerClasses}>
      <div className="FilePicker__button" aria-disabled={Boolean(isDisabled)}>
        <label
          className="Button Button--tertiary Button--md"
          htmlFor="file-picker"
        >
          <span className="Button__icon">
            <Icon.FileCode01 />
          </span>
          Select a File
        </label>
        <input
          type="file"
          id="file-picker"
          accept={acceptedExtension[0]}
          hidden
          onChange={(e) =>
            handleChange(e as React.ChangeEvent<HTMLInputElement>)
          }
          disabled={Boolean(isDisabled)}
        />
      </div>

      {errorMessage ? (
        <Message type="error">
          <Icon.XCircle /> {errorMessage}
        </Message>
      ) : (
        <Message type={selectedFile ? "success" : "info"}>
          {selectedFile
            ? formatSelectedFileMessage(selectedFile)
            : `or drop your ${acceptedExtension[0]} file here`}
        </Message>
      )}
    </div>
  );
};
