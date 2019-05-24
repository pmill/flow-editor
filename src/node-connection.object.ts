import {NodeOutputObject} from "./node-output.object";
import {RenderableObject} from "./renderable.object";
import {HasDomNode} from "./has-dom-node.object";
import {Diagram} from "./diagram";
import {PathGenerator} from "./path-generator";
import {PositionObject} from "./position.object";
import {HasPosition} from "./behaviours/has-position";
import {DraggableObject} from "./behaviours/draggable.object";
import {Subject} from "rxjs/index";
import {DraggingObject} from "./behaviours/dragging.object";
import {NodeObject} from "./node.object";
import {CursorObject} from "./cursor.object";

export enum NodeConnectionState {
    Unlinked = 'unlinked',
    Linking = 'linking',
    Linked = 'linked',
}

export class NodeConnectionObject extends RenderableObject implements DraggableObject{
    protected settingsButton: Element;

    protected context: HasDomNode;
    protected destination: HasPosition;

    protected currentState = NodeConnectionState.Unlinked;

    protected settingsButtonHtml: string;
    protected arrowHtml: string;
    protected plusHtml: string;

    protected stateConnectionIcons: {
        unlinked: string|Element,
        linking: string|Element,
        linked: string|Element,
    } = {
        unlinked: null,
        linking: null,
        linked: null,
    };

    protected stateStyles = {
        unlinked: {
            color: "transparent",
        },
        linking: {
            color: "#77dd77",
        },
        linked: {
            color: "#9edfff",
        }
    };

    // Draggable
    public onDragStartSubscriber = new Subject<DraggingObject>();
    public onDragOverElementSubscriber = new Subject<DraggingObject>();
    public onDragStopSubscriber = new Subject<DraggingObject>();

    constructor(
        protected diagram: Diagram,
        protected nodeSource: NodeOutputObject,
    ) {
        super(diagram);

        this.nodeSource.getPositionChangedSubscriber().subscribe((value: any) => {
            console.log('nodeSource moved');
            this.render(this.context);
        });
    }

    getDiagram(): Diagram {
        return this.diagram;
    }

    getDragHandle(): HTMLElement {
        return this.domNode.querySelector('*[drag-handle]');
    }

    getDomNode() {
        return this.domNode;
    }

    setDestination(destination: HasPosition) {
        this.destination = destination;

        if (destination instanceof CursorObject) {
            this.currentState = NodeConnectionState.Linking;
        } else {
            this.currentState = NodeConnectionState.Linked;
        }

        this.destination.getPositionChangedSubscriber().subscribe((position: PositionObject) => {
            this.render(this.context);
        });
    }

    createDomNode(context: HasDomNode) {
        this.context = context;

        if (!this.domNode) {
            this.domNode = document.createElementNS('http://www.w3.org/2000/svg', "path");
            this.domNode.setAttribute("stroke-width", "3px");
            this.domNode.setAttribute("fill", "none");
            this.domNode.setAttribute("stroke-linejoin", "round");

            this.diagram.getSvgContainer().appendChild(this.domNode);
        }

        this.setupDraggable();

        for (let state of Object.keys(this.stateConnectionIcons)) {
            if (typeof this.stateConnectionIcons[state] === "string") {
                this.stateConnectionIcons[state] = this.generateDomNode(this.stateConnectionIcons[state], {});
                this.stateConnectionIcons[state].classList.add('node-connection-end-' + state);
                this.stateConnectionIcons[state].classList.add('drag-handle');

                this.stateConnectionIcons[state].addEventListener('mousedown', (event: MouseEvent) => {
                    CursorObject.Instance.setPositionFromEvent(event);
                    this.setDestination(CursorObject.Instance);
                    this.diagram.setDraggingObject(new DraggingObject(this, CursorObject.Instance.getPosition()));
                    this.render(this.context);
                });

                this.diagram.getDomNode().appendChild(this.stateConnectionIcons[state]);
            }
        }

        if (!this.settingsButton && this.settingsButtonHtml) {
            this.settingsButton = this.generateDomNode(this.settingsButtonHtml, {});
            this.settingsButton.classList.add('node-connection-settings-button');

            this.settingsButton.addEventListener('click', () => {
                this.diagram.onConnectionSettingsButtonClicked.next(this);
            });

            this.diagram.getDomNode().appendChild(this.settingsButton);
        }

        this.onDragStopSubscriber.subscribe((dropTarget: any) => {
            this.diagram.setDraggingObject(null);
            this.destination = null;

            if (dropTarget instanceof NodeObject) {
                this.setDestination(dropTarget);
                this.currentState = NodeConnectionState.Linked;
            } else {
                this.currentState = NodeConnectionState.Unlinked;
            }

            this.render(this.context);
        });
    }

    render(context: HasDomNode) {
        const color = this.stateStyles[this.currentState].color;

        this.domNode.setAttribute("stroke", color);

        for (let state of Object.keys(this.stateConnectionIcons)) {
            if (state === this.currentState) {
                (<HTMLElement>this.stateConnectionIcons[state]).classList.remove('hidden');
                (<HTMLElement>this.stateConnectionIcons[state]).classList.add('active');
            } else {
                (<HTMLElement>this.stateConnectionIcons[state]).classList.remove('active');
                (<HTMLElement>this.stateConnectionIcons[state]).classList.add('hidden');
            }
        }

        if (this.currentState === NodeConnectionState.Unlinked || !this.destination) {
            this.domNode.setAttribute("d", "");

            if (this.settingsButton) {
                this.settingsButton.classList.add('hidden');
            }

            return;
        }

        const sourceConnectionPoint = this.nodeSource.getConnectionPoint();
        const destinationConnectionPoint = this.destination.getConnectionPoint();

        this.domNode.setAttribute("d", PathGenerator.generatePathBetween(sourceConnectionPoint, destinationConnectionPoint));

        const connectionIconRect = (<HTMLElement>this.stateConnectionIcons[this.currentState]).getBoundingClientRect();
        const x = destinationConnectionPoint.x - (connectionIconRect.width / 2);
        const y = destinationConnectionPoint.y - connectionIconRect.height;

        (<HTMLElement>this.stateConnectionIcons[this.currentState]).style.left = x + 'px';
        (<HTMLElement>this.stateConnectionIcons[this.currentState]).style.top = y + 'px';

        if (this.settingsButton) {
            const domNodePath = <SVGPathElement>this.domNode;
            const connectionLength = domNodePath.getTotalLength();
            const connectionHalfPoint = domNodePath.getPointAtLength(connectionLength / 2);

            const settingsButtonRect = this.settingsButton.getBoundingClientRect();
            const radius = (settingsButtonRect.right - settingsButtonRect.left) / 2;

            const x = connectionHalfPoint.x - radius;
            const y = connectionHalfPoint.y - radius;

            (<HTMLElement>this.settingsButton).style.left = x + 'px';
            (<HTMLElement>this.settingsButton).style.top = y + 'px';

            this.settingsButton.classList.remove('hidden');

            for (let state of Object.keys(this.stateConnectionIcons)) {
                this.settingsButton.classList.remove('node-connection-state-' + state);
            }

            this.settingsButton.classList.add('node-connection-state-' + this.currentState);
        }
    }

    setStateConnectionIconViewTemplateId(state: NodeConnectionState, templateId: string) {
        this.stateConnectionIcons[state] = document.getElementById(templateId).innerHTML;
    }

    setSettingsButtonViewTemplateId(templateId: string) {
        this.settingsButtonHtml = document.getElementById(templateId).innerHTML;
    }

    // Draggable
    setupDraggable: () => void;
    onDragStart: (position: PositionObject) => void;
    onDragOver: (position: PositionObject, target: any) => void;
    onDragStop: (target: any) => void;
}
