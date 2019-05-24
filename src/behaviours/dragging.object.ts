import {PositionObject} from "../position.object";
import {DraggableObject} from "./draggable.object";

export class DraggingObject {
    constructor(
        public element: DraggableObject,
        public offset: PositionObject = null,
    ) {
        if (offset === null) {
            this.offset = new PositionObject(0, 0);
        }
    }
}
