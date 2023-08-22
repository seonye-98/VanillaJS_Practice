export default class {
  params: Record<string, string>;
  constructor(params: Record<string, string>) {
    this.params = params;
  }
  setTitle(title: string) {
    document.title = title;
  }

  async getHtml() {
    return '';
  }
}
