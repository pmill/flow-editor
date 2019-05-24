import {PositionObject} from "./position.object";
import {HasPosition} from "./behaviours/has-position";
import {Subject} from "rxjs/index";

export class CursorObject implements HasPosition{
    private static _instance: CursorObject;

    protected position: PositionObject;
    protected positionChangedSubscriber = new Subject<PositionObject>();

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    getConnectionPoint(): PositionObject {
        return this.position;
    }

    getPosition(): PositionObject {
        return this.position;
    }

    getPositionChangedSubscriber(): Subject<PositionObject> {
        return this.positionChangedSubscriber;
    }

    setPosition(position: PositionObject) {
        this.position = position;
        this.positionChangedSubscriber.next(position);
    }

    setPositionFromEvent(event: MouseEvent) {
        const position = new PositionObject(
            event.clientX,
            event.clientY,
        );

        this.setPosition(position);
    }
}