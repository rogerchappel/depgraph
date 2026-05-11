// UI button component
export class Button {
  private label: string;

  constructor(label: string) {
    this.label = label;
  }

  render(): string {
    return `<button>${this.label}</button>`;
  }
}
