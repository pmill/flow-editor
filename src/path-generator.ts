import Path from "svg-path-generator";
import {PositionObject} from "./position.object";

const originOffset = 20;
const destinationPadding = 0;
const destinationOffset = 20;

export class PathGenerator {
    static generatePathBetween(source: PositionObject, destination: PositionObject) {
        const heightDifference = destination.y - source.y - originOffset;
        const widthDifference = destination.x - source.x;

        if (heightDifference > destinationOffset) {
            return Path()
                .moveTo(source.x, source.y)
                .relative().verticalLineTo(originOffset)
                .relative().verticalLineTo(heightDifference / 2)
                .relative().horizontalLineTo(widthDifference + destinationPadding)
                .verticalLineTo(destination.y)
                .end();
        } else {
            return Path()
                .moveTo(source.x, source.y)
                .relative().verticalLineTo(originOffset)
                .relative().horizontalLineTo(widthDifference / 2)
                .verticalLineTo(destination.y - destinationOffset)
                .horizontalLineTo(destination.x + destinationPadding)
                .verticalLineTo(destination.y)
                .end();
        }
    }

    static generateStraightLineBetween(source: PositionObject, destination: PositionObject) {
        return Path()
            .moveTo(source.x, source.y)
            .relative().verticalLineTo(originOffset)
            .lineTo(destination.x, destination.y - originOffset)
            .relative().verticalLineTo(originOffset)
            .end();
    }

    static generateCenteredTriangle(centerPoint: PositionObject, diameter: number) {
        let radius = diameter / 2;

        return Path()
            .moveTo(centerPoint.x - radius, centerPoint.y - (radius * 1.5))
            .relative().horizontalLineTo(diameter)
            .lineTo(centerPoint.x, centerPoint.y)
            //.relative().lineTo((diameter * 1.1), -radius)
            .close()
            .end();
    }
}
