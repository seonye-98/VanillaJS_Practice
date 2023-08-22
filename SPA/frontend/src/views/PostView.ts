import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  postId: string;
  constructor(params: Record<string, string>) {
    super(params);
    this.postId = params.id;
    this.setTitle('Viewing Post');
  }
  async getHtml(): Promise<string> {
    console.log(this.params.id);
    return `
        <h1>Posts</h1>
        <p>You are viewing post #${this.postId}</p>
    `;
  }
}
