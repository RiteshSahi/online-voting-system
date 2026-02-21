export const derivePhase = (event) => {
  const now = new Date();

  const candidateDeadline = new Date(event.candidateDeadline);
  const votingStart = new Date(event.votingStart);
  const votingEnd = new Date(event.votingEnd);

  if (!candidateDeadline || !votingStart || !votingEnd) return "INVALID";

  if (now < candidateDeadline) return "APPLICATION";
  if (now < votingStart) return "VERIFICATION";
  if (now <= votingEnd) return "VOTING";
  return "CLOSED";
};
