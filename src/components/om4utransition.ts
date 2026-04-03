import { customElement } from '../api/decorator/customElement.js';
import { Attribute } from '../api/decorator/attribute.js';

@customElement('om4u-transition')
export class Om4uTransition extends HTMLElement {
  @Attribute('forward')
  declare forward: string;

  @Attribute('back')
  declare back: string;

  @Attribute('drilldown')
  declare drilldown: string;

  @Attribute('rollup')
  declare rollup: string;
}
