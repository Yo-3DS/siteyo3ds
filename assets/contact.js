(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Colle ici l'URL de ton webhook Discord (Paramètres du salon > Intégrations > Webhooks).
  const WEBHOOK_URL = 'https://discord.com/api/webhooks/1538843387770175531/5CnJuRGNrI0golRgZrrn6kSjM77ar12q03EQx9iQ1QdqHva2popVwIWGiQ9l2ahnTcIi';

  // Ton identifiant Discord, utilisé pour te mentionner dans le message reçu.
  const DISCORD_USER_ID = '1132771221604421682';

  const isFrench = document.documentElement.lang === 'fr';
  const messages = isFrench
    ? {
        sending: 'Envoi en cours...',
        success: 'Message envoyé ! Je vous répondrai dès que possible.',
        error: 'Le message n\'a pas pu être envoyé. Réessaie plus tard, ou contacte-moi directement sur Discord.',
        missingConfig: 'Le formulaire n\'est pas encore configuré. Contacte-moi directement sur Discord en attendant.',
        cooldown: 'Merci de patienter un peu avant d\'envoyer un nouveau message.',
      }
    : {
        sending: 'Sending...',
        success: 'Message sent! I\'ll get back to you as soon as possible.',
        error: 'The message could not be sent. Please try again later, or contact me directly on Discord.',
        missingConfig: 'The form isn\'t set up yet. Please contact me directly on Discord in the meantime.',
        cooldown: 'Please wait a bit before sending another message.',
      };

  const statusEl = document.getElementById('form-status');
  const nameInput = document.getElementById('cf-name');
  const contactInput = document.getElementById('cf-contact');
  const messageInput = document.getElementById('cf-message');
  const honeypot = document.getElementById('cf-website');
  const submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.classList.remove('is-success', 'is-error');
    if (kind) statusEl.classList.add(kind);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Piège anti-bot : un vrai visiteur ne remplit jamais ce champ caché.
    if (honeypot && honeypot.value.trim() !== '') {
      form.reset();
      setStatus(messages.success, 'is-success');
      return;
    }

    if (!nameInput.value.trim() || !contactInput.value.trim() || !messageInput.value.trim()) {
      return;
    }

    if (WEBHOOK_URL.indexOf('PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE') !== -1) {
      setStatus(messages.missingConfig, 'is-error');
      return;
    }

    const lastSent = parseInt(localStorage.getItem('contactLastSent') || '0', 10);
    if (Date.now() - lastSent < 30000) {
      setStatus(messages.cooldown, 'is-error');
      return;
    }

    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();
    const message = messageInput.value.trim();

    // Un email cliquable (mailto:), sinon un pseudo Discord préfixé par @.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactFormatted = emailPattern.test(contact)
      ? '[' + contact + '](mailto:' + contact + ')'
      : (contact.charAt(0) === '@' ? contact : '@' + contact);

    submitBtn.disabled = true;
    setStatus(messages.sending, null);

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '<@' + DISCORD_USER_ID + '> New message from the website!',
        embeds: [{
          color: 3001809,
          fields: [
            { name: 'From', value: name.slice(0, 256) },
            { name: 'Contact', value: contactFormatted.slice(0, 1024) },
            { name: 'Message', value: message.slice(0, 1024) },
          ],
          timestamp: new Date().toISOString(),
        }],
        allowed_mentions: { parse: [], users: [DISCORD_USER_ID] },
      }),
    })
      .then(function (response) {
        submitBtn.disabled = false;
        if (response.ok) {
          localStorage.setItem('contactLastSent', String(Date.now()));
          form.reset();
          setStatus(messages.success, 'is-success');
        } else {
          setStatus(messages.error, 'is-error');
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        setStatus(messages.error, 'is-error');
      });
  });
})();
