describe('init test', () => {
  it('should pass', (done) => {
    done();
  });

  it('should under test env', () => {
    const { NODE_ENV } = process.env;
    expect(NODE_ENV).toBe('test');
  });
});
