import { customElement } from '../api/decorator/customElement.js';
import { Attribute } from '../api/decorator/attribute.js';

@customElement('om4u-transition')
export class Om4uTransition extends HTMLElement {
  @Attribute('id')
  declare id: string;

  @Attribute('transition')
  declare transition: string;
}
