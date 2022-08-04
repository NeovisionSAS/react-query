export class AbortError extends DOMException {
  constructor(reason?: string) {
    super(reason ?? 'The operation was aborted.', 'AbortError');
  }
}
