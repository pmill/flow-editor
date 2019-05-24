import {Diagram} from "./diagram";
import {NodeObject} from "./node.object";
import {DropTargetObject} from "./behaviours/drop-target.object";
import {DraggableObject} from "./behaviours/draggable.object";
import {NodeConnectionObject, NodeConnectionState} from "./node-connection.object";

export {Diagram} from './diagram';
export {NodeObject} from './node.object';
export {NodeOutputObject} from './node-output.object';
export {NodeConnectionState} from "./node-connection.object";
export {RenderableObject} from './renderable.object';
export {PositionObject} from './position.object';

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

applyMixins(Diagram, [DropTargetObject]);
applyMixins(NodeObject, [DropTargetObject, DraggableObject]);
applyMixins(NodeConnectionObject, [DraggableObject]);
