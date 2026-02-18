export const validateEventTimeline = ({
  applicationStart,
  applicationEnd,
  votingStart,
  votingEnd
}) => {

  if (applicationStart >= applicationEnd) {
    return "Application end must be after application start";
  }

  if (applicationEnd >= votingStart) {
    return "Voting must start after application ends";
  }

  if (votingStart >= votingEnd) {
    return "Voting end must be after voting start";
  }

  return null; // valid timeline
};
