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
  const blob = new Blob([value], {
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
