/* Shared scene state. ChatGPT-assisted; all modules use this state, not an individual mechanic. */
window.Story = {
  notice: '', open: false, opening: 0, reveal: 0, turn: 0, turnKind: '', turnSwapped: false,
  season: 0, previousSeason: 0, seasonBlend: 1, page: 0,
  elapsed: 0, night: 0, targetNight: 0, sun: .75,
  manualLightUntil: 0, cycleTime: 0
};
