import {NodeObject} from "./node.object";
import {HasDomNode} from "./has-dom-node.object";
import {PositionObject} from "./position.object";
import {DropTargetObject} from "./behaviours/drop-target.object";
import {Subject} from "rxjs/index";
import {DraggingObject} from "./behaviours/dragging.object";
import {CursorObject} from "./cursor.object";
import {NodeConnectionObject} from "./node-connection.object";

export class Diagram extends HasDomNode implements DropTargetObject {
    // DropTarget
    public onElementOverDropTargetSubscriber = new Subject<DraggingObject>();
    public onElementDroppedOnDropTargetSubscriber = new Subject<DraggingObject>();

    public onConnectionSettingsButtonClicked = new Subject<NodeConnectionObject>();
    public onConnectionDroppedOnDiagram = new Subject<NodeConnectionObject>();

    protected draggingObject: DraggingObject;

    protected svgContainer: SVGSVGElement;

    protected nodes: NodeObject[] = [];

    addNode(node: NodeObject) {
        this.nodes.push(node);
    }

    render(containerNode: HTMLElement) {
        this.domNode = containerNode;

        this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        this.svgContainer.classList.add('svg-container');
        this.domNode.appendChild(this.svgContainer);

        CursorObject.Instance.getPositionChangedSubscriber().subscribe((position: PositionObject) => {
            if (this.draggingObject) {
                const offsetPosition = new PositionObject(
                    position.x - this.draggingObject.offset.x,
                    position.y - this.draggingObject.offset.y,
                );

                this.draggingObject.element.setPosition(offsetPosition);
            }
        });

        this.onElementDroppedOnDropTargetSubscriber.subscribe((draggingObject: DraggingObject) => {
            if (draggingObject.element instanceof NodeConnectionObject) {
                this.onConnectionDroppedOnDiagram.next(draggingObject.element);
            }
        });

        for (const node of this.nodes) {
            node.createDomNode(this);
        }

        for (const node of this.nodes) {
            node.render(this);
        }

        this.setupDropTarget();
    }

    getSvgContainer(): SVGSVGElement {
        return this.svgContainer;
    }

    getDiagram(): Diagram {
        return this;
    }

    getDomNode() {
        return this.domNode;
    }

    getDraggingObject(): DraggingObject {
        return this.draggingObject;
    }

    setDraggingObject(object: DraggingObject) {
        this.draggingObject = object;

        if (!this.draggingObject) {
            return;
        }

        for (const node of this.nodes) {
            const domNode = <HTMLElement>node.getDomNode();
            domNode.style.zIndex = "1";
        }

        const domNode = <HTMLElement>this.draggingObject.element.getDomNode();
        domNode.style.zIndex = "2";
    }

// DropTarget
    setupDropTarget: () => void;
    onElementOverDropTarget: () => void;
    onElementDroppedOnDropTarget: () => void;
}
