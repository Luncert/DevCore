
class AcceleratorManager {

  private handlers = new Map<string, Callback>();

  handle(accelerator: string) {
    const handler = this.handlers.get(accelerator);
    if (handler) {
      handler();
    }
  }

  on(accelerator: string, handler: Callback) {
    this.handlers.set(accelerator, handler);
  }

  off(accelerator: string) {
    this.handlers.delete(accelerator);
  }
}

const mgr = new AcceleratorManager();
export default mgr;
