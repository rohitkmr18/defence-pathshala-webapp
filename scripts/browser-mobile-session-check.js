// Evaluate with agent-browser on a loaded, long-question targeted/full-paper attempt.
// This checks geometry after normal document scrolling, rather than screenshots.
(() => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const actions = document.querySelector('[data-session-actions]');
  const options = [...document.querySelectorAll('[role="radio"]')];
  assert(actions && options.length === 4, 'Expected an active four-option question');
  assert(!document.querySelector('nav[aria-label="Mobile learning navigation"]'), 'Global nav must be absent during attempts');
  const last = options.at(-1);
  last.scrollIntoView({ block: 'center', behavior: 'instant' });
  const optionRect = last.getBoundingClientRect();
  const actionRect = actions.getBoundingClientRect();
  const viewport = { width: innerWidth, height: innerHeight };
  assert(document.documentElement.scrollWidth <= innerWidth, 'Horizontal overflow');
  assert(document.scrollingElement.scrollHeight > innerHeight && scrollY > 0, 'Long question must scroll with the document');
  assert(optionRect.top >= 0 && optionRect.bottom <= innerHeight, 'Final option must be fully reachable');
  assert(optionRect.bottom <= actionRect.top, 'Session actions must clear the final option');
  assert(actionRect.bottom <= innerHeight + 1, 'Session actions must stay inside the viewport');
  const ancestors = [];
  for (let parent = actions.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    ancestors.push({ tag: parent.tagName, overflowY: style.overflowY });
    if (innerWidth < 1024) assert(style.overflowY === 'visible' || style.overflowY === 'clip', 'Nested vertical scroll container');
  }
  return { viewport, scrollY, documentHeight: document.scrollingElement.scrollHeight,
    option: { top: optionRect.top, bottom: optionRect.bottom },
    actions: { top: actionRect.top, bottom: actionRect.bottom, bottomOffset: getComputedStyle(actions).bottom,
      paddingBottom: getComputedStyle(actions).paddingBottom }, ancestors };
})();
