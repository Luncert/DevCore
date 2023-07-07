
class AcceleratorManager {

  private handlers = new Map<string, Callback>();

  handle(accelerator: string) {
    this.handlers.forEach(c => c());
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
