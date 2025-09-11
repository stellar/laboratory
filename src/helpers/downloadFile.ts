export const downloadFile = ({
  value,
  fileType,
  fileName,
  fileExtension,
}: {
  value: string | ArrayBuffer | Buffer;
  fileType: string;
  fileName: string;
  fileExtension: string;
}) => {
  // Create blob
  let blobValue: BlobPart;
  if (value instanceof Buffer) {
    blobValue = new Uint8Array(value);
  } else if (typeof value === "string" || value instanceof ArrayBuffer) {
    blobValue = value;
  } else {
    blobValue = new Uint8Array(value);
  }
  const blob = new Blob([blobValue], {
    type: fileType,
  });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${fileName}.${fileExtension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
