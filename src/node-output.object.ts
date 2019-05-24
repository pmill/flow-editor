import {NodeConnectionObject} from "./node-connection.object";
import {RenderableObject} from "./renderable.object";
import {HasDomNode} from "./has-dom-node.object";
import {NodeObject} from "./node.object";
import {PositionObject} from "./position.object";
import {Diagram} from "./diagram";
import {HasPosition} from "./behaviours/has-position";
import {CursorObject} from "./cursor.object";
import {DraggingObject} from "./behaviours/dragging.object";

export class NodeOutputObject extends RenderableObject {
    protected connection: NodeConnectionObject;

    constructor(
        diagram: Diagram,
    ) {
        super(diagram);

        this.connection = new NodeConnectionObject(diagram, this);
    }

    connectTo(destination: HasPosition): NodeConnectionObject {
        this.connection.setDestination(destination);

        return this.connection;
    }

    createDomNode(context: NodeObject) {
        if (!this.domNode) {
            this.domNode = this.generateDomNode(this.viewHtml, this.viewAttributes);
            if (this.initialPosition) {
                this.setPositionOnDomNode(this.initialPosition);
            }

            context.getDomNode().querySelector('*[container="nodeOutputs"]').appendChild(this.domNode);
        }

        if (this.connection) {
            this.connection.createDomNode(this);
        }

        this.domNode.addEventListener('mousedown', (event: MouseEvent) => {
            CursorObject.Instance.setPositionFromEvent(event);
            this.connection.setDestination(CursorObject.Instance);
            this.diagram.setDraggingObject(new DraggingObject(
                this.connection,
                CursorObject.Instance.getPosition()
            ));
        });

        context.getPositionChangedSubscriber().subscribe((position: PositionObject) => {
            this.connection.render(context);
        });
    }

    render(context: HasDomNode) {
        if (this.connection) {
            this.connection.render(this);
            this.domNode.classList.add('connected');
        } else {
            this.domNode.classList.remove('connected');
        }
    }

    getConnectionPoint() {
        const htmlElement = <HTMLElement>this.domNode.querySelector('*[output-connector]');
        const rect = htmlElement.getBoundingClientRect();

        return new PositionObject(
            rect.left + (rect.width / 2),
            rect.top + (rect.height / 2),
        );
    }
}
