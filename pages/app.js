var app = document.getElementById('app');

var tabBtns = document.querySelectorAll('.tab-btn');
var tabPanels = document.querySelectorAll('.tab-panel');

function activateTab(tabId, color, rgb) {
  tabBtns.forEach(function(b) {
    var isActive = b.dataset.tab === tabId;
    b.classList.toggle('active', isActive);
    b.style.color = isActive ? '#2E2E2E' : '';
    b.style.borderBottomColor = isActive ? color : 'transparent';
    b.querySelector('.tab-dot').style.opacity = isActive ? '1' : '0';
    b.querySelector('.tab-dot').style.background = isActive ? color : '';
    b.querySelector('.tab-num').style.opacity = isActive ? '1' : '0.5';
    b.querySelector('.tab-num').style.color = isActive ? color : '';
  });
  tabPanels.forEach(function(p) {
    p.classList.toggle('active', p.id === 'panel-' + tabId);
  });
  app.style.setProperty('--phase-color', color);
  app.style.setProperty('--phase-rgb', rgb);
}

tabBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    activateTab(btn.dataset.tab, btn.dataset.color, btn.dataset.rgb);
  });
});

document.querySelectorAll('.radio-opt').forEach(function(opt) {
  opt.addEventListener('click', function() {
    var list = opt.closest('.radio-list');
    list.querySelectorAll('.radio-opt').forEach(function(o) { o.classList.remove('selected'); });
    opt.classList.add('selected');
    updateStatus();
  });
});

function panelHasContent(panelId) {
  var panel = document.getElementById(panelId);
  var hasText = false;
  panel.querySelectorAll('input, textarea').forEach(function(el) {
    if (el.value.trim()) hasText = true;
  });
  return hasText || !!panel.querySelector('.radio-opt.selected');
}

function updateStatus() {
  var panels = ['panel-branding', 'panel-design', 'panel-development'];
  var filled = panels.filter(panelHasContent).length;
  var el = document.getElementById('submitStatus');
  if (filled === 3) {
    el.textContent = '✓ All three sections have responses — ready to send!';
    el.classList.add('ready');
  } else {
    el.textContent = filled + ' of 3 sections started · You can submit whenever you\'re ready';
    el.classList.remove('ready');
  }
}

document.querySelectorAll('.field-input, .field-textarea').forEach(function(el) {
  el.addEventListener('input', updateStatus);
});

var FIELDS = {
  branding: [
    { id: 'businessName', label: 'Business name' },
    { id: 'tagline', label: 'Business tagline' },
    { id: 'oneLiner', label: 'Describe your business in one sentence' },
    { id: 'mission', label: 'Mission statement' },
    { id: 'coreValues', label: 'Core values' },
    { id: 'idealClient', label: 'Ideal client' },
    { id: 'personality', label: 'Brand personality (three words)' },
    { id: 'voice', label: 'Brand voice' },
    { id: 'inspiration', label: 'Visual inspiration brands' },
    { id: 'colorsLove', label: 'Colors/fonts/styles you love' },
    { id: 'colorsHate', label: 'Colors/fonts/styles you do NOT want' }
  ],
  design: [
    { id: 'situation', label: 'Current website situation', radio: 'situation' },
    { id: 'shortGoals', label: 'Short-term business goals (3-6 months)' },
    { id: 'longGoals', label: 'Long-term business goals' },
    { id: 'dreamSite', label: 'Dream website description' },
    { id: 'sitesLove', label: 'Inspiration website links' },
    { id: 'designStyle', label: 'Design style' },
    { id: 'mustHave', label: 'Must-haves on the site' },
    { id: 'mustNotHave', label: 'Must-nots on the site' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'otherSocial', label: 'Other social profiles' }
  ],
  development: [
    { id: 'domain', label: 'Domain name' },
    { id: 'hosting', label: 'Hosting provider' },
    { id: 'bizEmail', label: 'Business email address' },
    { id: 'crm', label: 'Email list provider / CRM' },
    { id: 'cart', label: 'Shopping cart' },
    { id: 'payment', label: 'Payment processor' },
    { id: 'journey', label: 'Customer journey' },
    { id: 'traffic', label: 'Traffic strategy' },
    { id: 'afterPurchase', label: 'After-purchase process' },
    { id: 'refunds', label: 'Refund policies and terms' }
  ]
};

function getVal(field) {
  if (field.radio) {
    var sel = document.querySelector('[data-group="' + field.radio + '"] .radio-opt.selected');
    return sel ? sel.dataset.value : '';
  }
  var el = document.getElementById(field.id);
  return el ? el.value.trim() : '';
}

document.getElementById('sendBtn').addEventListener('click', function() {
  var biz = (document.getElementById('businessName').value || '').trim() || 'New Client';
  var subject = 'New Client Onboarding — ' + biz;
  var sep = '─'.repeat(36);
  var body = 'CLIENT ONBOARDING SUBMISSION\n' + sep + '\n\n';

  [
    { heading: 'BRANDING', fields: FIELDS.branding },
    { heading: 'DESIGN', fields: FIELDS.design },
    { heading: 'DEVELOPMENT', fields: FIELDS.development }
  ].forEach(function(section) {
    var lines = [];
    section.fields.forEach(function(f) {
      var v = getVal(f);
      if (v) lines.push(f.label + ':\n' + v);
    });
    if (lines.length) {
      body += section.heading + '\n' + '─'.repeat(section.heading.length) + '\n\n';
      body += lines.join('\n\n') + '\n\n\n';
    }
  });

  window.location.href = 'mailto:hello@karenlewiscreative.com'
    + '?subject=' + encodeURIComponent(subject)
    + '&body=' + encodeURIComponent(body);
});
