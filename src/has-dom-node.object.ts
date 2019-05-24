import {PositionObject} from "./position.object";
import * as Handlebars from "handlebars";

export class HasDomNode {
    protected domNode: Element;
    protected initialPosition: PositionObject;

    generateDomNode(viewHtml: string, viewAttributes: {[key: string]: any}): Element {
        const template = Handlebars['default'].compile(viewHtml);
        const renderedTemplate = template(viewAttributes).trim();

        const domTemplate = document.createElement('template');
        domTemplate.innerHTML = renderedTemplate;

        return <HTMLElement>domTemplate.content.firstElementChild;
    }

    getDomNode(){
        return this.domNode;
    }

    getPositionFromDomNode(): PositionObject {
        const htmlElement = <HTMLElement>this.domNode;

        return new PositionObject(
            parseFloat(htmlElement.style.left.replace('px', '')),
            parseFloat(htmlElement.style.top.replace('px', '')),
        );
    }

    setPositionOnDomNode(position: PositionObject) {
        if (!this.domNode) {
            this.initialPosition = position;
            return;
        }

        const htmlElement = <HTMLElement>this.domNode;

        htmlElement.style.top = position.y + 'px';
        htmlElement.style.left = position.x + 'px';
    }
}
