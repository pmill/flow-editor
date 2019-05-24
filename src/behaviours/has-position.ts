import {PositionObject} from "../position.object";
import {Subject} from "rxjs/index";

export interface HasPosition {
    getConnectionPoint(): PositionObject;
    getPosition(): PositionObject;
    getPositionChangedSubscriber(): Subject<PositionObject>;
    setPosition(position: PositionObject);
}