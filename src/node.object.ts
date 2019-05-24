import {NodeOutputObject} from "./node-output.object";
import {RenderableObject} from "./renderable.object";
import {HasDomNode} from "./has-dom-node.object";
import {PositionObject} from "./position.object";
import {DraggableObject} from "./behaviours/draggable.object";
import {Subject} from "rxjs/index";
import {Diagram} from "./diagram";
import {HasPosition} from "./behaviours/has-position";
import {DraggingObject} from "./behaviours/dragging.object";
import {DropTargetObject} from "./behaviours/drop-target.object";

export class NodeObject extends RenderableObject implements DraggableObject, DropTargetObject, HasPosition {
    protected outputs: NodeOutputObject[] = [];

    // DropTarget
    public onElementOverDropTargetSubscriber = new Subject<DraggingObject>();
    public onElementDroppedOnDropTargetSubscriber = new Subject<DraggingObject>();

    // Draggable
    public onDragStartSubscriber = new Subject<DraggingObject>();
    public onDragOverElementSubscriber = new Subject<DraggingObject>();
    public onDragStopSubscriber = new Subject<DraggingObject>();

    getDiagram(): Diagram {
        return this.diagram;
    }

    getDragHandle(): HTMLElement {
        return this.domNode.querySelector('*[drag-handle]');
    }

    getDomNode() {
        return this.domNode;
    }

    getPosition(): PositionObject {
        return this.getPositionFromDomNode();
    }

    addOutput(output: NodeOutputObject) {
        this.outputs.push(output);
    }

    createDomNode(context: HasDomNode) {
        if (!this.domNode) {
            this.domNode = this.generateDomNode(this.viewHtml, this.viewAttributes);
            if (this.initialPosition) {
                this.setPositionOnDomNode(this.initialPosition);
            }

            context.getDomNode().appendChild(this.domNode);

            this.setupDraggable();
            this.setupDropTarget();

            this.onDragStopSubscriber.subscribe((dropTarget: any) => {
                this.diagram.setDraggingObject(null);
            });
        }

        for (const output of this.outputs) {
            output.createDomNode(this);
        }
    }

    render(context: HasDomNode) {
        for (const output of this.outputs) {
            output.render(this);
        }
    }

    getConnectionPoint(): PositionObject {
        const htmlElement = <HTMLElement>this.domNode;
        const rect = htmlElement.getBoundingClientRect();

        return new PositionObject(
            rect.left + (rect.width / 2),
            rect.top,
        );
    }

    // Draggable
    setupDraggable: () => void;
    onDragStart: (position: PositionObject) => void;
    onDragOver: (position: PositionObject, target: any) => void;
    onDragStop: (target: any) => void;

    // DropTarget
    setupDropTarget: () => void;
    onElementOverDropTarget: () => void;
    onElementDroppedOnDropTarget: () => void;
}