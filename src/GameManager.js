import * as BABYLON from 'babylonjs';
import {GameManger} from './BabylonScript/GameManager';

export default function GameManager(canvasRef) {
    if (!canvasRef) {
      throw new Error("Canvas is not provided!");
    }
    const engine = new BABYLON.Engine(
      canvasRef,
      true,
      // this.props.engineOptions,
      // this.props.adaptToDeviceRatio
    );

    const GManger = new GameManger(canvasRef, engine);

    return {
      GManger,
    };
}
