export const delayedAction = ({
  action,
  delay,
}: {
  action: () => void;
  delay: number;
}) => {
  const t = setTimeout(() => {
    action();
    clearTimeout(t);
  }, delay);
};
