(() => {
  const data = window.letterData;
  document.querySelectorAll('[data-field]').forEach(element => {
    element.textContent = data[element.dataset.field] ?? '';
  });
  document.title = 'i made you something.';
  const date = document.getElementById('letter-date');
  date.dateTime = data.date;
  date.textContent = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(`${data.date}T12:00:00Z`));
  document.getElementById('salutation').textContent = data.salutation;
  const shyDoodle = document.createElement('img');
  shyDoodle.src = './assets/noun_silly_2293761.svg';
  shyDoodle.alt = '';
  shyDoodle.setAttribute('aria-hidden', 'true');
  shyDoodle.className = 'doodle salutation-doodle';
  shyDoodle.width = 40;
  shyDoodle.height = 40;
  document.getElementById('salutation').prepend(shyDoodle);
  document.querySelector('.signature').hidden = !data.closing;
  document.querySelector('.postscript').hidden = !data.postscript;
  document.getElementById('letter-content').replaceChildren(...data.paragraphs.map((text, index) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    const decorationSource = data.paragraphDecorations?.[index];
    if (decorationSource) {
      const decoration = document.createElement('img');
      decoration.src = decorationSource;
      decoration.alt = '';
      decoration.setAttribute('aria-hidden', 'true');
      decoration.className = 'paragraph-decoration';
      decoration.width = 64;
      decoration.height = 64;
      paragraph.prepend(decoration);
    }
    return paragraph;
  }));
  const closed = document.getElementById('envelope-view');
  const opened = document.getElementById('letter-view');
  const envelope = document.getElementById('envelope');
  const openButton = document.getElementById('open-letter');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let opening = false;
  async function openLetter() {
    if (opening || !opened.hidden) return;
    opening = true;
    closed.classList.add('opening');
    if (!reducedMotion.matches) {
      await Promise.allSettled(envelope.getAnimations({ subtree: true }).map(animation => animation.finished));
    }
    closed.hidden = true;
    opened.hidden = false;
    envelope.setAttribute('aria-expanded', 'true');
    openButton.setAttribute('aria-expanded', 'true');
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('salutation').focus({ preventScroll: true });
    opening = false;
  }
  envelope.addEventListener('click', openLetter);
  openButton.addEventListener('click', openLetter);
  document.getElementById('back').addEventListener('click', () => {
    opened.hidden = true;
    closed.hidden = false;
    closed.classList.remove('opening');
    envelope.setAttribute('aria-expanded', 'false');
    openButton.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
    envelope.focus({ preventScroll: true });
  });
})();
