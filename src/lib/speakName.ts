const NAME_ARABIC = 'سَنَاء';

export function speakName() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(NAME_ARABIC);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}
