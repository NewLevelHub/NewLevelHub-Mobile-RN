// Tell React 19 that this environment supports act() so state updates
// triggered by notifyManager.setScheduler don't produce spurious warnings.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
