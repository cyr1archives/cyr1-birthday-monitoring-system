const sounds = {
  click: new Audio("/sounds/click.mp3"),
  notify: new Audio("/sounds/notify.mp3"),
  success: new Audio("/sounds/success.mp3")
};

Object.values(sounds).forEach(a => {
  a.volume = 0.25;
  a.preload = "auto";
});

export function playSound(name) {
  const audio = sounds[name];
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}
