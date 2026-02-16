export const allowedTransitions = {
  APPLICATION: ["VERIFICATION"],
  VERIFICATION: ["VOTING"],
  VOTING: ["CLOSED"],
  CLOSED: []
};
export const canTransition = (current, next) => {
  return allowedTransitions[current]?.includes(next);
};
