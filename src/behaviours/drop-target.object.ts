import {Subject} from "rxjs/index";
import {DraggableObject} from "./draggable.object";
import {CursorObject} from "../cursor.object";
import {DraggingObject} from "./dragging.object";

export abstract class DropTargetObject {
    public onElementOverDropTargetSubscriber = new Subject<DraggingObject>();
    public onElementDroppedOnDropTargetSubscriber = new Subject<DraggingObject>();

    abstract getDomNode();
    abstract getDiagram();

    setupDropTarget() {
        const domNode = this.getDomNode();

        domNode.addEventListener('mousemove', (event: MouseEvent) => {
            event.preventDefault();

            CursorObject.Instance.setPositionFromEvent(event);
        });

        domNode.addEventListener('mouseup', (event: MouseEvent) => {
            event.preventDefault();
            const draggingObject = this.getDiagram().getDraggingObject();

            if (draggingObject) {
                this.onElementDroppedOnDropTarget(draggingObject);
                this.getDiagram().setDraggingObject(null);
            }
        });
    }

    onElementOverDropTarget(draggingObject: DraggingObject) {
        this.onElementOverDropTargetSubscriber.next(draggingObject);
    }

    onElementDroppedOnDropTarget(draggingObject: DraggingObject) {
        this.onElementDroppedOnDropTargetSubscriber.next(draggingObject);
        draggingObject.element.onDragStop(this);
    }

    /*return (target) => {
        target.prototype.setupDraggable = () => {
            this.dragHandle = this.domNode.querySelector('*[drag-handle]');
            if (!this.dragHandle) {
                return;
            }

            this.dragHandle.addEventListener('mousemove', (event: MouseEvent) => {
                event.preventDefault();

                const rect = this.domNode.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const draggingElement = this.diagram.getDraggingObject();

                if (draggingElement) {
                    draggingElement.draggingOver(
                        new PositionObject(x, y),
                        this
                    )
                }
            });

            this.dragHandle.addEventListener('mouseup', (event: MouseEvent) => {
                event.preventDefault();

                const draggingElement = this.diagram.getDraggingObject();

                if (draggingElement) {
                    const position = PositionObject.fromEventAndHtmlElement(event, this.domNode);

                    this.elementDropped(position, draggingElement);
                    draggingElement.droppedOn(position, this)
                }
            });
        };

        target.prototype.elementDropped = (position: PositionObject, element: any) => {

        };
    }*/
}
