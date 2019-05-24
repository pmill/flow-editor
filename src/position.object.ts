export class PositionObject {
    constructor(
       public x: number,
       public y: number,
    ) {}

    static fromEvent(event: MouseEvent): PositionObject {
        return new PositionObject(event.clientX, event.clientY);
    }

    static fromEventAndRect(event: MouseEvent, clientRect: ClientRect): PositionObject {
        const x = event.clientX - clientRect.left;
        const y = event.clientY - clientRect.top;

        return new PositionObject(x, y);
    }

    static fromEventAndHtmlElement(event: MouseEvent, element: HTMLElement): PositionObject {
        return PositionObject.fromEventAndRect(event, element.getBoundingClientRect());
    }
}