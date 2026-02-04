// Runtime diagnostics for unmasking production errors
// Prefix: [RUNTIME_DIAG]

export function safeStringify(obj: any, maxDepth = 3): string {
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, val) => {
      if (val != null && typeof val === 'object') {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      if (typeof val === 'function') {
        return '[Function]';
      }
      if (val instanceof Error) {
        return {
          name: val.name,
          message: val.message,
          stack: val.stack
        };
      }
      return val;
    }, 2);
  } catch (error) {
    return `[StringifyError: ${error instanceof Error ? error.message : String(error)}]`;
  }
}

// Global error handler for synchronous errors
window.addEventListener('error', (event) => {
  console.error('[RUNTIME_DIAG] Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    error: event.error
  });
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[RUNTIME_DIAG] Unhandled Rejection:', {
    reason: safeStringify(event.reason),
    promise: event.promise
  });
});

// Log React errors if they exist
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Call original
    originalConsoleError.apply(console, args);
    
    // Check if this looks like a React error
    const firstArg = args[0];
    if (typeof firstArg === 'string' && 
        (firstArg.includes('Warning:') || firstArg.includes('Error:'))) {
      console.log('[RUNTIME_DIAG] React Console Error:', args);
    }
  };
}

console.log('[RUNTIME_DIAG] Runtime diagnostics initialized');
