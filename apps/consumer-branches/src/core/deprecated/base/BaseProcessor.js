class BaseProcessor {
  execute() {
    this.extract();
    this.validate();
    return this.process();
  }

  extract() {}

  validate() {}

  process() {}
}

export default BaseProcessor;
