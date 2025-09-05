import { AnyObject } from "@/types/types";

const TAB = "  ";

export const formatContractInterface = (
  contractInterface: AnyObject | null,
): string => {
  if (!contractInterface || !Object.keys(contractInterface).length) {
    return "// No interface available";
  }

  let output = "";

  // Contract-level docs
  if (contractInterface.doc) {
    output += `/// ${contractInterface.doc}\n`;
  }

  // Functions
  output += functionsOutput(contractInterface.functions);

  // Structs
  output += structsOutput(contractInterface.structs);

  // Unions
  output += unionsOutput(contractInterface.unions);

  // Errors
  output += errorsOutput(contractInterface.errors);

  return output;
};

const functionsOutput = (functions: any) => {
  let funcsString = "";

  if (
    functions &&
    typeof functions === "object" &&
    Object.keys(functions).length
  ) {
    funcsString += `// ==========================================\n`;
    funcsString += `// Functions\n`;
    funcsString += `// ==========================================\n\n`;

    Object.entries(functions).forEach((funcItem) => {
      const key = funcItem[0];
      const value = funcItem[1] as any;

      if (value.doc) {
        value.doc.split("\n").forEach((line: string) => {
          funcsString += `/// ${line}\n`;
        });
      }

      funcsString += `fn ${key}(${formatFnInputs(value.inputs)}) ${formatFnOutputs(value.outputs)}\n\n`;
    });
  }

  return funcsString;
};

const structsOutput = (structs: any) => {
  let structsString = "";

  if (structs && typeof structs === "object" && Object.keys(structs).length) {
    structsString += `// ==========================================\n`;
    structsString += `// Structs\n`;
    structsString += `// ==========================================\n\n`;

    Object.entries(structs).forEach((structItem) => {
      const key = structItem[0];
      const value = structItem[1] as any;

      structsString += `#[contracttype]\n`;
      structsString += `struct ${key} {\n`;

      if (
        value.fields &&
        typeof value.fields === "object" &&
        Object.keys(value.fields).length
      ) {
        Object.entries(value.fields).forEach((fieldItem) => {
          const fieldKey = fieldItem[0];
          const fieldValue = fieldItem[1] as any;

          if (fieldValue.doc) {
            fieldValue.doc.split("\n").forEach((line: string) => {
              structsString += `${TAB}/// ${line}\n`;
            });
          }

          structsString += `${TAB}${fieldKey}: ${fieldValue.type},\n`;
        });
      }

      structsString += "}\n\n";
    });
  }

  return structsString;
};

const unionsOutput = (unions: any) => {
  let unionsString = "";

  if (unions && typeof unions === "object" && Object.keys(unions).length) {
    unionsString += `// ==========================================\n`;
    unionsString += `// Unions\n`;
    unionsString += `// ==========================================\n\n`;

    Object.entries(unions).forEach((unionItem) => {
      const key = unionItem[0];
      const value = unionItem[1] as any;

      unionsString += `#[contracttype]\n`;
      unionsString += `enum ${key} {\n`;

      if (
        value.cases &&
        typeof value.cases === "object" &&
        Object.keys(value.cases).length
      ) {
        Object.entries(value.cases).forEach((caseItem) => {
          const caseKey = caseItem[0];
          const caseValue = caseItem[1] as any;

          unionsString += `${TAB}${caseKey}(${caseValue?.length ? caseValue.join(",") : ""}),\n`;
        });
      }

      unionsString += "}\n\n";
    });
  }

  return unionsString;
};

const errorsOutput = (errors: any) => {
  let errorsString = "";

  if (errors && typeof errors === "object" && Object.keys(errors).length) {
    errorsString += `// ==========================================\n`;
    errorsString += `// Errors\n`;
    errorsString += `// ==========================================\n\n`;

    errorsString += `#[contracttype]\n`;
    errorsString += `enum Errors {\n`;

    Object.entries(errors).forEach((errorItem) => {
      const key = errorItem[0];
      const value = errorItem[1] as any;

      errorsString += `${TAB}${key} = ${value?.value ?? ""},\n`;
    });

    errorsString += "}\n\n";
  }

  return errorsString;
};

const formatFnInputs = (inputs: any) => {
  if (!inputs) {
    return "";
  }

  return Object.entries(inputs)
    .map(([key, value]) => {
      return `${key}: ${(value as any).type}`;
    })
    .join(", ");
};

const formatFnOutputs = (outputs: any) => {
  const outputType = outputs?.[0];

  return outputType ? `-> ${outputType}` : "";
};
