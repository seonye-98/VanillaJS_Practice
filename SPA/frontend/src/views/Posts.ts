import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params: Record<string, string>) {
    super(params);
    this.setTitle('Posts');
  }
  async getHtml(): Promise<string> {
    return `
        <h1>Posts</h1>
        <p>You are viewing the posts!</p>
        <a href="/posts/1" data-link>Post 1</a><br/>
        <a href="/posts/2" data-link>Post 2</a><br/>
        <a href="/posts/3" data-link>Post 3</a><br/>
    `;
  }
}
