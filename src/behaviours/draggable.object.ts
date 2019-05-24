import {PositionObject} from "../position.object";
import {Subject} from "rxjs/index";
import {Diagram} from "../diagram";
import {DraggingObject} from "./dragging.object";

export abstract class DraggableObject {
    public onDragStartSubscriber = new Subject<DraggingObject>();
    public onDragOverElementSubscriber = new Subject<DraggingObject>();
    public onDragStopSubscriber = new Subject<DraggingObject>();

    abstract getDragHandle(): HTMLElement;
    abstract getDiagram(): Diagram;
    abstract getDomNode();
    abstract setPosition(position: PositionObject);

    setupDraggable() {
        const domNode = this.getDomNode();
        const dragHandle = this.getDragHandle();

        if (!dragHandle) {
            return;
        }

        dragHandle.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            this.onDragStart(
                PositionObject.fromEventAndHtmlElement(event, domNode)
            );
        });
    };

    onDragStart(position: PositionObject) {
        this.getDomNode().classList.add('dragging');

        const draggableObject = new DraggingObject(
            this,
            position
        );

        this.getDiagram().setDraggingObject(draggableObject);
        this.onDragStartSubscriber.next(draggableObject);
    }

    onDragOver(position: PositionObject, target: any) {
        const draggableObject = new DraggingObject(
            this,
            position
        );

        this.setPosition(position);
        this.onDragOverElementSubscriber.next(draggableObject);
    }

    onDragStop(target: any) {
        this.getDomNode().classList.remove('dragging');
        this.onDragStopSubscriber.next(target);
    }
}
