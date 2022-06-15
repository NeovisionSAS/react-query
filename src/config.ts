export const backend = {
  port: 3000,
  domain: 'localhost',
  protocol: 'http',
  get url() {
    return `${this.protocol}://${this.domain}:${this.port}`;
  },
};

export const database = {
  port: 4000,
  domain: backend.domain,
};
