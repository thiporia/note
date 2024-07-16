type ClassValue = string | number | boolean | undefined | null;
type ClassObject = { [key: string]: any };
type ClassArray = ClassValue[];
type ClassNameValue = ClassValue | ClassObject | ClassArray;

export function classnames(...args: ClassNameValue[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(arg.toString());
    } else if (Array.isArray(arg)) {
      const innerClasses = classnames(...arg);
      if (innerClasses) {
        classes.push(innerClasses);
      }
    } else if (typeof arg === "object") {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(" ");
}
