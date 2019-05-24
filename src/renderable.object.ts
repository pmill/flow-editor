import {HasDomNode} from "./has-dom-node.object";
import {Subject} from "rxjs/index";
import {Diagram} from "./diagram";
import {PositionObject} from "./position.object";

export class RenderableObject extends HasDomNode {
    protected positionChangedSubscriber = new Subject<PositionObject>();

    protected viewAttributes: {[key: string]: any} = {};
    protected viewHtml: string;

    constructor(
        protected diagram: Diagram,
    ) {
        super();
    }

    render(context: HasDomNode) {
    }

    setPosition(position: PositionObject) {
        this.setPositionOnDomNode(position);
        this.positionChangedSubscriber.next(position);
    }

    getPositionChangedSubscriber(): Subject<{x: number, y: number}> {
        return this.positionChangedSubscriber;
    }

    setViewAttribute(key: string, value: any) {
        this.viewAttributes[key] = value;
    }

    setViewHtml(html: string) {
        this.viewHtml = html;
    }

    setViewTemplateId(templateId: string) {
        this.viewHtml = document.getElementById(templateId).innerHTML;
    }
}
